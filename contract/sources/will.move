module will_contract_addr::will {
    use std::signer;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin;
    use aptos_framework::timestamp;
    use aptos_framework::table;
    use std::option::{Self, Option};
    use std::vector;
    
    const DEFAULT_TIMEOUT: u64 = 120; // 2 minutes
    const ERR_ALREADY_EXISTS: u64 = 1;
    const ERR_NOT_FOUND: u64 = 2;
    const ERR_TOO_SOON: u64 = 3;
    const ERR_NOT_RECIPIENT: u64 = 4;
    const ERR_REGISTRY_NOT_INITIALIZED: u64 = 5;
    
    struct Will has copy, drop, store {
        owner: address,
        recipient: address,
        amount: u64,
        last_ping_time: u64,
        timeout_secs: u64,
    }
    
    struct WillState has key {
        wills: table::Table<address, Will>,
        balances: table::Table<address, coin::Coin<AptosCoin>>,
    }
    
    // Global registry to track recipients and their associated owners
    struct GlobalWillRegistry has key {
        recipient_to_owners: table::Table<address, vector<address>>,
    }
    
    // Initialize the global registry (should be called once by the contract deployer)
    public entry fun initialize_global_registry(account: &signer) {
        let addr = signer::address_of(account);
        assert!(!exists<GlobalWillRegistry>(addr), ERR_ALREADY_EXISTS);
        move_to(account, GlobalWillRegistry {
            recipient_to_owners: table::new(),
        });
    }
    
    public entry fun initialize(account: &signer) {
        let addr = signer::address_of(account);
        assert!(!exists<WillState>(addr), ERR_ALREADY_EXISTS);
        move_to(account, WillState {
            wills: table::new(),
            balances: table::new(),
        });
    }
    
    public entry fun create_will(
        account: &signer,
        recipient: address,
        amount: u64,
        registry_addr: address // Address where the global registry is stored
    ) acquires WillState, GlobalWillRegistry {
        let owner = signer::address_of(account);
        let state = borrow_global_mut<WillState>(owner);
        assert!(!table::contains(&state.wills, owner), ERR_ALREADY_EXISTS);
        
        let now = timestamp::now_seconds();
        
        // Withdraw and lock the amount
        let locked_funds = coin::withdraw<AptosCoin>(account, amount);
        table::add(&mut state.balances, owner, locked_funds);
        table::add(&mut state.wills, owner, Will {
            owner,
            recipient,
            amount,
            last_ping_time: now,
            timeout_secs: DEFAULT_TIMEOUT,
        });
        
        // Update global registry
        assert!(exists<GlobalWillRegistry>(registry_addr), ERR_REGISTRY_NOT_INITIALIZED);
        let registry = borrow_global_mut<GlobalWillRegistry>(registry_addr);
        
        if (table::contains(&registry.recipient_to_owners, recipient)) {
            let owners = table::borrow_mut(&mut registry.recipient_to_owners, recipient);
            vector::push_back(owners, owner);
        } else {
            let owners = vector::empty<address>();
            vector::push_back(&mut owners, owner);
            table::add(&mut registry.recipient_to_owners, recipient, owners);
        };
    }
    
    public entry fun ping(account: &signer) acquires WillState {
        let owner = signer::address_of(account);
        let state = borrow_global_mut<WillState>(owner);
        assert!(table::contains(&state.wills, owner), ERR_NOT_FOUND);
        
        let will = table::borrow_mut(&mut state.wills, owner);
        will.last_ping_time = timestamp::now_seconds();
    }
    
    // Improved claim function - recipient doesn't need to specify owner
    public entry fun claim(
        account: &signer, 
        registry_addr: address,
        owner_index: u64 // Index in the owners list (0 for first, 1 for second, etc.)
    ) acquires WillState, GlobalWillRegistry {
        let recipient = signer::address_of(account);
        
        // Get the registry
        assert!(exists<GlobalWillRegistry>(registry_addr), ERR_REGISTRY_NOT_INITIALIZED);
        let registry = borrow_global_mut<GlobalWillRegistry>(registry_addr);
        
        // Find owners who have wills for this recipient
        assert!(table::contains(&registry.recipient_to_owners, recipient), ERR_NOT_FOUND);
        let owners = table::borrow_mut(&mut registry.recipient_to_owners, recipient);
        
        // Get the specific owner by index
        assert!(owner_index < vector::length(owners), ERR_NOT_FOUND);
        let owner = *vector::borrow(owners, owner_index);
        
        // Access the owner's WillState
        assert!(exists<WillState>(owner), ERR_NOT_FOUND);
        let owner_state = borrow_global_mut<WillState>(owner);
        
        // Check if there's a will for this owner
        assert!(table::contains(&owner_state.wills, owner), ERR_NOT_FOUND);
        let will = table::borrow(&owner_state.wills, owner);
        
        // Verify the recipient is correct
        assert!(recipient == will.recipient, ERR_NOT_RECIPIENT);
        
        // Check if enough time has passed
        let now = timestamp::now_seconds();
        assert!(now > will.last_ping_time + will.timeout_secs, ERR_TOO_SOON);
        
        // Transfer the funds
        let coins = table::remove(&mut owner_state.balances, owner);
        coin::deposit<AptosCoin>(recipient, coins);
        
        // Clean up
        table::remove(&mut owner_state.wills, owner);
        
        // Remove from registry
        vector::remove(owners, owner_index);
        if (vector::length(owners) == 0) {
            table::remove(&mut registry.recipient_to_owners, recipient);
        };
    }
    
    // Simple claim function for when there's only one will
    public entry fun claim_single(
        account: &signer, 
        registry_addr: address
    ) acquires WillState, GlobalWillRegistry {
        claim(account, registry_addr, 0); // Claim the first (and presumably only) will
    }
    
    #[view]
    public fun get_will(addr: address): Option<Will> acquires WillState {
        if (exists<WillState>(addr)) {
            let state = borrow_global<WillState>(addr);
            if (table::contains(&state.wills, addr)) {
                option::some(*table::borrow(&state.wills, addr))
            } else {
                option::none<Will>()
            }
        } else {
            option::none<Will>()
        }
    }
    
    // Get all wills for a recipient
    #[view]
    public fun get_wills_for_recipient(recipient: address, registry_addr: address): vector<Will> acquires WillState, GlobalWillRegistry {
        let wills = vector::empty<Will>();
        
        if (!exists<GlobalWillRegistry>(registry_addr)) {
            return wills
        };
        
        let registry = borrow_global<GlobalWillRegistry>(registry_addr);
        
        if (!table::contains(&registry.recipient_to_owners, recipient)) {
            return wills
        };
        
        let owners = table::borrow(&registry.recipient_to_owners, recipient);
        let i = 0;
        let len = vector::length(owners);
        
        while (i < len) {
            let owner = *vector::borrow(owners, i);
            if (exists<WillState>(owner)) {
                let state = borrow_global<WillState>(owner);
                if (table::contains(&state.wills, owner)) {
                    let will = table::borrow(&state.wills, owner);
                    if (will.recipient == recipient) {
                        vector::push_back(&mut wills, *will);
                    };
                };
            };
            i = i + 1;
        };
        
        wills
    }
    
    // Get claimable wills for a recipient (where timeout has passed)
    #[view]
    public fun get_claimable_wills_for_recipient(recipient: address, registry_addr: address): vector<Will> acquires WillState, GlobalWillRegistry {
        let claimable_wills = vector::empty<Will>();
        
        if (!exists<GlobalWillRegistry>(registry_addr)) {
            return claimable_wills
        };
        
        let registry = borrow_global<GlobalWillRegistry>(registry_addr);
        
        if (!table::contains(&registry.recipient_to_owners, recipient)) {
            return claimable_wills
        };
        
        let owners = table::borrow(&registry.recipient_to_owners, recipient);
        let i = 0;
        let len = vector::length(owners);
        let now = timestamp::now_seconds();
        
        while (i < len) {
            let owner = *vector::borrow(owners, i);
            if (exists<WillState>(owner)) {
                let state = borrow_global<WillState>(owner);
                if (table::contains(&state.wills, owner)) {
                    let will = table::borrow(&state.wills, owner);
                    if (will.recipient == recipient && now > will.last_ping_time + will.timeout_secs) {
                        vector::push_back(&mut claimable_wills, *will);
                    };
                };
            };
            i = i + 1;
        };
        
        claimable_wills
    }
    
    // Get count of wills for a recipient
    #[view]
    public fun get_will_count_for_recipient(recipient: address, registry_addr: address): u64 acquires GlobalWillRegistry {
        if (!exists<GlobalWillRegistry>(registry_addr)) {
            return 0
        };
        
        let registry = borrow_global<GlobalWillRegistry>(registry_addr);
        
        if (!table::contains(&registry.recipient_to_owners, recipient)) {
            return 0
        };
        
        let owners = table::borrow(&registry.recipient_to_owners, recipient);
        vector::length(owners)
    }
}
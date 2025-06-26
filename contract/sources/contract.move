module contract::will {
    use std::signer;
    use std::error;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    /// Error codes
    const E_NOT_OWNER: u64 = 1;
    const E_NOT_RECIPIENT: u64 = 2;
    const E_INVALID_RECIPIENT: u64 = 3;
    const E_NO_FUNDS: u64 = 4;
    const E_WILL_NOT_INITIALIZED: u64 = 5;

    /// The Will resource that holds the state
    struct Will has key {
        owner: address,
        recipient: address,
        funds: coin::Coin<AptosCoin>,
    }

    /// Initialize a new will - must be called by the owner
    public entry fun initialize_will(owner: &signer) {
        let owner_addr = signer::address_of(owner);
        
        // Create the will resource with empty funds
        let will = Will {
            owner: owner_addr,
            recipient: @0x0, // No recipient initially
            funds: coin::zero<AptosCoin>(),
        };
        
        // Move the resource to the owner's account
        move_to(owner, will);
    }

    /// Deposit funds into the will
    public entry fun deposit(owner: &signer, amount: u64) acquires Will {
        let owner_addr = signer::address_of(owner);
        
        // Check if will exists
        assert!(exists<Will>(owner_addr), error::not_found(E_WILL_NOT_INITIALIZED));
        
        let will = borrow_global_mut<Will>(owner_addr);
        
        // Only owner can deposit
        assert!(will.owner == owner_addr, error::permission_denied(E_NOT_OWNER));
        
        // Withdraw coins from owner's account and add to will
        let deposit_coins = coin::withdraw<AptosCoin>(owner, amount);
        coin::merge(&mut will.funds, deposit_coins);
    }

    /// Set the recipient of the will
    public entry fun set_recipient(owner: &signer, recipient_addr: address) acquires Will {
        let owner_addr = signer::address_of(owner);
        
        // Check if will exists
        assert!(exists<Will>(owner_addr), error::not_found(E_WILL_NOT_INITIALIZED));
        
        let will = borrow_global_mut<Will>(owner_addr);
        
        // Only owner can set recipient
        assert!(will.owner == owner_addr, error::permission_denied(E_NOT_OWNER));
        
        // Check for valid recipient address
        assert!(recipient_addr != @0x0, error::invalid_argument(E_INVALID_RECIPIENT));
        
        will.recipient = recipient_addr;
    }

    /// Claim funds from the will (called by recipient)
    public entry fun claim(recipient: &signer, will_owner_addr: address) acquires Will {
        let recipient_addr = signer::address_of(recipient);
        
        // Check if will exists
        assert!(exists<Will>(will_owner_addr), error::not_found(E_WILL_NOT_INITIALIZED));
        
        let will = borrow_global_mut<Will>(will_owner_addr);
        
        // Only recipient can claim
        assert!(will.recipient == recipient_addr, error::permission_denied(E_NOT_RECIPIENT));
        
        // Check if there are funds to claim
        let funds_amount = coin::value(&will.funds);
        assert!(funds_amount > 0, error::invalid_state(E_NO_FUNDS));
        
        // Transfer all funds to recipient
        let funds_to_transfer = coin::extract_all(&mut will.funds);
        coin::deposit(recipient_addr, funds_to_transfer);
    }

    #[view]
    /// Get the balance of the will (view function)
    public fun get_balance(will_owner_addr: address): u64 acquires Will {
        if (!exists<Will>(will_owner_addr)) {
            return 0
        };
        
        let will = borrow_global<Will>(will_owner_addr);
        coin::value(&will.funds)
    }

    #[view]
    /// Get will information (view function)
    public fun get_will_info(will_owner_addr: address): (address, address, u64) acquires Will {
        assert!(exists<Will>(will_owner_addr), error::not_found(E_WILL_NOT_INITIALIZED));
        
        let will = borrow_global<Will>(will_owner_addr);
        (will.owner, will.recipient, coin::value(&will.funds))
    }

    #[view]
    /// Check if a will exists for an address
    public fun will_exists(addr: address): bool {
        exists<Will>(addr)
    }

    #[view]
    /// Get the recipient address
    public fun get_recipient(will_owner_addr: address): address acquires Will {
        assert!(exists<Will>(will_owner_addr), error::not_found(E_WILL_NOT_INITIALIZED));
        let will = borrow_global<Will>(will_owner_addr);
        will.recipient
    }

    #[view]
    /// Get the owner address
    public fun get_owner(will_owner_addr: address): address acquires Will {
        assert!(exists<Will>(will_owner_addr), error::not_found(E_WILL_NOT_INITIALIZED));
        let will = borrow_global<Will>(will_owner_addr);
        will.owner
    }
}
module will_contract_addr::will {
    use std::signer;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::coin;
    use aptos_framework::timestamp;
    use aptos_framework::table;
    use std::option::{Self, Option};

    const DEFAULT_TIMEOUT: u64 = 120; // 2 minutes
    const ERR_ALREADY_EXISTS: u64 = 1;
    const ERR_NOT_FOUND: u64 = 2;
    const ERR_TOO_SOON: u64 = 3;
    const ERR_NOT_RECIPIENT: u64 = 4;

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
        amount: u64
    ) acquires WillState {
        let owner = signer::address_of(account);
        let state = borrow_global_mut<WillState>(owner);
        assert!(!table::contains(&state.wills, owner), ERR_ALREADY_EXISTS);

        let now = timestamp::now_seconds();

        // Withdraw funds and store in balances
        let locked_funds = coin::withdraw<AptosCoin>(account, amount);
        table::add(&mut state.balances, owner, locked_funds);

        table::add(&mut state.wills, owner, Will {
            owner,
            recipient,
            amount,
            last_ping_time: now,
            timeout_secs: DEFAULT_TIMEOUT,
        });
    }

    public entry fun ping(account: &signer) acquires WillState {
        let owner = signer::address_of(account);
        let state = borrow_global_mut<WillState>(owner);
        assert!(table::contains(&state.wills, owner), ERR_NOT_FOUND);

        let will = table::borrow_mut(&mut state.wills, owner);
        will.last_ping_time = timestamp::now_seconds();
    }

    public entry fun claim(account: &signer, owner: address) acquires WillState {
        let state = borrow_global_mut<WillState>(owner);
        assert!(table::contains(&state.wills, owner), ERR_NOT_FOUND);

        let will = table::borrow(&state.wills, owner);
        let now = timestamp::now_seconds();

        assert!(signer::address_of(account) == will.recipient, ERR_NOT_RECIPIENT);
        assert!(now > will.last_ping_time + will.timeout_secs, ERR_TOO_SOON);

        let coins = table::remove(&mut state.balances, owner);
        coin::deposit<AptosCoin>(signer::address_of(account), coins);

        table::remove(&mut state.wills, owner);
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
}

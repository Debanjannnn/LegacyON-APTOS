module contract::smart_will {
    use std::{signer, string, error, vector, option, timestamp};
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    const E_WILL_EXISTS: u64 = 1;
    const E_WILL_NOT_EXISTS: u64 = 2;
    const E_INVALID_RECIPIENT: u64 = 3;
    const E_NOT_RECIPIENT: u64 = 4;
    const E_OWNER_STILL_ACTIVE: u64 = 5;
    const E_NO_FUNDS: u64 = 6;
    const E_INVALID_DESCRIPTION: u64 = 7;

    struct Will has key {
        start_time: u64,
        last_visited: u64,
        ten_years: u64,
        recipient: address,
        description: string::String,
        exists: bool,
        balance: coin::Coin<AptosCoin>
    }

    struct WillRegistry has key {
        creators: vector<address>
    }

    /// Initialize will for a user
    public entry fun create_will(
        account: &signer,
        recipient: address,
        description: string::String,
        deposit_amount: u64
    ) {
        let sender = signer::address_of(account);
        assert!(!exists<Will>(sender), error::already_exists(E_WILL_EXISTS));
        assert!(recipient != @0x0 && recipient != sender, error::invalid_argument(E_INVALID_RECIPIENT));
        assert!(coin::balance<AptosCoin>(account) >= deposit_amount, error::invalid_argument(E_NO_FUNDS));
        assert!(string::length(&description) >= 50, error::invalid_argument(E_INVALID_DESCRIPTION));

        let coins = coin::withdraw<AptosCoin>(account, deposit_amount);
        let time = timestamp::now_seconds();
        let will = Will {
            start_time: time,
            last_visited: time,
            ten_years: 10 * 365 * 24 * 60 * 60,
            recipient,
            description,
            exists: true,
            balance: coins
        };

        move_to(account, will);

        if (!exists<WillRegistry>(@0x1)) {
            move_to(&aptos_framework::account::create_signer(@0x1), WillRegistry { creators: vector::empty<address>() });
        }

        let registry = borrow_global_mut<WillRegistry>(@0x1);
        vector::push_back(&mut registry.creators, sender);
    }

    public entry fun ping(account: &signer) acquires Will {
        let sender = signer::address_of(account);
        assert!(exists<Will>(sender), error::not_found(E_WILL_NOT_EXISTS));
        let will = borrow_global_mut<Will>(sender);
        will.last_visited = timestamp::now_seconds();
    }

    public entry fun claim(account: &signer, creator: address) acquires Will {
        let claimer = signer::address_of(account);
        assert!(exists<Will>(creator), error::not_found(E_WILL_NOT_EXISTS));

        let will = borrow_global_mut<Will>(creator);
        assert!(claimer == will.recipient, error::permission_denied(E_NOT_RECIPIENT));
        assert!(timestamp::now_seconds() > will.last_visited + will.ten_years, error::invalid_state(E_OWNER_STILL_ACTIVE));
        assert!(coin::value(&will.balance) > 0, error::invalid_state(E_NO_FUNDS));

        let coins = coin::extract(&mut will.balance, coin::value(&will.balance));
        coin::deposit<AptosCoin>(claimer, coins);

        // Remove will (cleanup optional, no native support for delete in Move 1.0)
        move_from<Will>(creator);
    }

    public entry fun change_recipient(account: &signer, new_recipient: address) acquires Will {
        let sender = signer::address_of(account);
        assert!(exists<Will>(sender), error::not_found(E_WILL_NOT_EXISTS));
        assert!(new_recipient != @0x0 && new_recipient != sender, error::invalid_argument(E_INVALID_RECIPIENT));

        let will = borrow_global_mut<Will>(sender);
        will.recipient = new_recipient;
        will.last_visited = timestamp::now_seconds();
    }

    public entry fun deposit(account: &signer, amount: u64, new_recipient: address) acquires Will {
        let sender = signer::address_of(account);
        assert!(exists<Will>(sender), error::not_found(E_WILL_NOT_EXISTS));
        assert!(new_recipient != @0x0 && new_recipient != sender, error::invalid_argument(E_INVALID_RECIPIENT));

        let will = borrow_global_mut<Will>(sender);
        let coins = coin::withdraw<AptosCoin>(account, amount);
        coin::merge(&mut will.balance, coins);
        will.recipient = new_recipient;
        will.last_visited = timestamp::now_seconds();
    }

    #[view]
    public fun get_balance(account: address): u64 acquires Will {
        assert!(exists<Will>(account), error::not_found(E_WILL_NOT_EXISTS));
        let will = borrow_global<Will>(account);
        coin::value(&will.balance)
    }

    #[view]
    public fun get_total_wills(): u64 acquires WillRegistry {
        if (!exists<WillRegistry>(@0x1)) {
            return 0;
        };
        let registry = borrow_global<WillRegistry>(@0x1);
        vector::length(&registry.creators)
    }

    #[view]
    public fun get_all_wills(): vector<address> acquires WillRegistry {
        if (!exists<WillRegistry>(@0x1)) {
            return vector::empty<address>();
        };
        let registry = borrow_global<WillRegistry>(@0x1);
        registry.creators
    }

    #[view]
    public fun get_will_details(creator: address): (u64, u64, u64, address, string::String, bool, u64) acquires Will {
        assert!(exists<Will>(creator), error::not_found(E_WILL_NOT_EXISTS));
        let will = borrow_global<Will>(creator);
        (
            will.start_time,
            will.last_visited,
            will.ten_years,
            will.recipient,
            will.description,
            will.exists,
            coin::value(&will.balance)
        )
    }
}

/// SimpleWill module for managing a will-like contract on Aptos.
/// This module allows an owner to deposit APT tokens, set a recipient, and allows the recipient to claim the funds.
/// 
/// # Features
/// * Owner can deposit APT tokens
/// * Owner can set a recipient
/// * Recipient can claim deposited funds
/// * View function to check contract balance
/// 
/// # Resources
/// * `Will` - Stores:
///   - Owner address
///   - Recipient address
///   - Deposited amount
///   - Coin balance
/// 
/// # Errors
/// * `E_NOT_INITIALIZED` - Contract not initialized
/// * `E_ALREADY_INITIALIZED` - Contract already initialized
/// * `E_NOT_OWNER` - Caller is not the owner
/// * `E_INVALID_RECIPIENT` - Invalid recipient address
/// * `E_NOT_RECIPIENT` - Caller is not the recipient
/// * `E_NO_FUNDS` - No funds available to claim
/// 
/// # Dependencies
/// * AptosCoin
/// * Standard libraries (signer, error, coin, account)

module contract::simple_will {
    use std::signer;
    use std::error;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;

    const E_NOT_INITIALIZED: u64 = 1;
    const E_ALREADY_INITIALIZED: u64 = 2;
    const E_NOT_OWNER: u64 = 3;
    const E_INVALID_RECIPIENT: u64 = 4;
    const E_NOT_RECIPIENT: u64 = 5;
    const E_NO_FUNDS: u64 = 6;

    struct Will has key {
        owner: address,
        recipient: address,
        amount: u64,
        balance: coin::Coin<AptosCoin>,
    }

    public entry fun initialize(account: &signer) {
        let account_addr = signer::address_of(account);

        assert!(!exists<Will>(account_addr), error::already_exists(E_ALREADY_INITIALIZED));

        let will = Will {
            owner: account_addr,
            recipient: @0x0, amount: 0,
            balance: coin::zero<AptosCoin>(),
        };

        move_to(account, will);
    }

    public entry fun deposit(account: &signer, amount: u64) acquires Will {
        let account_addr = signer::address_of(account);

        assert!(exists<Will>(account_addr), error::not_found(E_NOT_INITIALIZED));

        let will = borrow_global_mut<Will>(account_addr);

        assert!(account_addr == will.owner, error::permission_denied(E_NOT_OWNER));
        assert!(amount > 0, error::invalid_argument(E_NO_FUNDS));

        let deposit_coins = coin::withdraw<AptosCoin>(account, amount);

        coin::merge(&mut will.balance, deposit_coins);

        will.amount = will.amount + amount;
    }

    public entry fun set_recipient(account: &signer, recipient_addr: address) acquires Will {
        let account_addr = signer::address_of(account);

        assert!(exists<Will>(account_addr), error::not_found(E_NOT_INITIALIZED));

        let will = borrow_global_mut<Will>(account_addr);

        assert!(account_addr == will.owner, error::permission_denied(E_NOT_OWNER));

        assert!(recipient_addr != @0x0, error::invalid_argument(E_INVALID_RECIPIENT));

        will.recipient = recipient_addr;
    }

    public entry fun claim(account: &signer) acquires Will {
        let account_addr = signer::address_of(account);

        assert!(exists<Will>(account_addr), error::not_found(E_NOT_INITIALIZED));

        let will = borrow_global_mut<Will>(account_addr);

        assert!(account_addr == will.recipient, error::permission_denied(E_NOT_RECIPIENT));

        assert!(will.amount > 0, error::not_found(E_NO_FUNDS));

        let claim_coins = coin::extract(&mut will.balance, will.amount);

        coin::deposit(account_addr, claim_coins);

        will.amount = 0;
    }

    #[view]
    public fun get_balance(account_addr: address): u64 acquires Will {
        assert!(exists<Will>(account_addr), error::not_found(E_NOT_INITIALIZED));

        let will = borrow_global<Will>(account_addr);
        coin::value(&will.balance)
    }
}
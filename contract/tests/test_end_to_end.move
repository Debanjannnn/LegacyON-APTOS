#[test_only]
module contract::test_simple_will {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::account;
    use aptos_framework::aptos_account;
    use aptos_framework::genesis;
    use contract::simple_will;

    #[test(owner = @0x123, recipient = @0x456, core = @0x1)]
    fun test_end_to_end(owner: &signer, recipient: &signer, core: &signer) {
        // Initialize test environment with genesis
        genesis::setup();

        // Set up accounts
        let owner_addr = signer::address_of(owner);
        let recipient_addr = signer::address_of(recipient);
        let core_addr = signer::address_of(core);

        account::create_account_for_test(core_addr);
        account::create_account_for_test(owner_addr);
        account::create_account_for_test(recipient_addr);

        // Register accounts for AptosCoin
        coin::register<AptosCoin>(core);
        coin::register<AptosCoin>(owner);
        coin::register<AptosCoin>(recipient);

        // Fund owner account from core account
        aptos_account::transfer_coins<AptosCoin>(core, owner_addr, 1000);

        // Initialize the will
        simple_will::initialize(owner);

        // Verify initial balance is 0
        let balance = simple_will::get_balance(owner_addr);
        assert!(balance == 0, 1);

        // Deposit 500 APT
        simple_will::deposit(owner, 500);

        // Verify balance is now 500
        let balance = simple_will::get_balance(owner_addr);
        assert!(balance == 500, 2);

        // Set recipient
        simple_will::set_recipient(owner, recipient_addr);

        // Recipient claims funds
        simple_will::claim(recipient);

        // Verify balance is now 0
        let balance = simple_will::get_balance(owner_addr);
        assert!(balance == 0, 3);

        // Verify recipient received 500 APT
        let recipient_balance = coin::balance<AptosCoin>(recipient_addr);
        assert!(recipient_balance == 500, 4);
    }
}
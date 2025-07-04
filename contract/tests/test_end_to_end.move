#[test_only]
module will_contract_addr::test_end_to_end {
    use std::signer;
    use aptos_framework::coin;
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::account;
    use aptos_framework::timestamp;

    use will_contract_addr::will;

    #[test(aptos_framework = @0x1, creator = @will_contract_addr, recipient = @0x2)]
    fun test_happy_path(
        aptos_framework: &signer,
        creator: &signer,
        recipient: &signer,
    ) {
        let creator_addr = signer::address_of(creator);
        let recipient_addr = signer::address_of(recipient);

        // Initialize AptosCoin for test
        let (burn_cap, mint_cap) = aptos_framework::aptos_coin::initialize_for_test(aptos_framework);

        // Create accounts and register AptosCoin
        account::create_account_for_test(creator_addr);
        account::create_account_for_test(recipient_addr);
        coin::register<AptosCoin>(creator); // Register coin for creator
        coin::register<AptosCoin>(recipient); // Register coin for recipient

        // Mint test AptosCoin for the creator
        aptos_framework::aptos_coin::mint(aptos_framework, creator_addr, 10_000_000); // 10 APT

        // Create a will with 1 APT
        will::create_will(creator, recipient_addr, 1_000_000); // 1 APT = 1,000,000 microAPT

        // Verify initial state
        let (recp, amt, _last_ping, timeout, claimed) = will::get_will_details(creator_addr);
        assert!(recp == recipient_addr, 1);
        assert!(amt == 1_000_000, 2);
        assert!(claimed == false, 3);
        assert!(timeout == 120, 4); // Default 2-minute timeout

        // Simulate time passing (advance timestamp for testing)
        timestamp::update_global_time_for_test_secs(130); // 130 seconds > 120-second timeout

        // Claim the will as the recipient
        will::claim_will(recipient, creator_addr);

        // Verify the will has been claimed
        let (_, _, _, _, claimed_after) = will::get_will_details(creator_addr);
        assert!(claimed_after == true, 5);
        assert!(coin::balance<AptosCoin>(recipient_addr) == 1_000_000, 6); // Recipient should have the amount

        // Clean up
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }

    #[test(aptos_framework = @0x1, creator = @will_contract_addr)]
    #[expected_failure(abort_code = 3, location = will_contract_addr::will)] // E_NOT_AUTHORIZED
    fun test_unauthorized_ping(
        aptos_framework: &signer,
        creator: &signer,
    ) {
        let creator_addr = signer::address_of(creator);
        let unauthorized_addr = @0x3;

        // Initialize AptosCoin for test
        let (burn_cap, mint_cap) = aptos_framework::aptos_coin::initialize_for_test(aptos_framework);

        // Create accounts and register AptosCoin
        account::create_account_for_test(creator_addr);
        coin::register<AptosCoin>(creator); // Register coin for creator
        account::create_account_for_test(unauthorized_addr);
        let unauthorized_signer = account::create_signer_for_test(unauthorized_addr);

        // Mint test AptosCoin for the creator
        aptos_framework::aptos_coin::mint(aptos_framework, creator_addr, 10_000_000);

        // Create a will
        will::create_will(creator, @0x2, 1_000_000);

        // Attempt to ping with unauthorized account (should fail with E_NOT_AUTHORIZED)
        will::ping_will(&unauthorized_signer);

        // Clean up
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }
}
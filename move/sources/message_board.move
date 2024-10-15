module fortuna_addr::fortuna {
    use std::string::{String};
    use std::vector;
    use std::signer;
    use std::aptos_coin::AptosCoin; 
    use std::aptos_account;
    use std::aptos_coin;
    use std::coin;
    use aptos_framework::event;

    const E_NOT_ENOUGH_COINS: u64 = 101;
    const E_CAUSE_NOT_FOUND: u64 = 102;
    const E_CAUSE_CLOSED: u64 = 103;
    const E_CAUSE_DUPLICATED_ID: u64 = 104;
    const E_NO_TICKETS: u64 = 105;

    const CONTRACT_ADDRESS: address = @fortuna_addr;

   struct UserStorage has key {
        causes: vector<Cause>,
    }

     struct Cause has store, copy, drop {
        id: u64,
        title: String,
        goal: u64,
        charity_percentage: u8,
        ticket_price: u64,  
        tickets: vector<address>,
        winner: address,
        open: bool,
    }

    #[event]
    struct CauseCreatedEvent has store, drop {
        user: address,
        cause_id: u64,
        cause_name: String,
        cause_goal: u64,
        cause_ticket_price: u64,  
        cause_charity_percentage: u8,
    }

     public entry fun create_cause(user: &signer, cause_name: String, cause_goal: u64, cause_charity_percentage: u8, cause_ticket_price: u64, new_cause_id: u64) acquires UserStorage {
        let user_addr = signer::address_of(user);

        if (!exists<UserStorage>(user_addr)) {
            let storage = UserStorage {
                causes: vector::empty<Cause>(), 
            };
            move_to(user, storage);
        };

        let storage_ref = borrow_global_mut<UserStorage>(user_addr);
        let length = vector::length(&storage_ref.causes);
        let i = 0;

        while (i < length) {
            let cause = vector::borrow_mut(&mut storage_ref.causes, i);
            assert!( cause.id != new_cause_id, E_CAUSE_DUPLICATED_ID);
            i = i + 1;
        };

        let new_cause = Cause {
            id: new_cause_id,
            title: cause_name,
            goal: cause_goal,
            charity_percentage: cause_charity_percentage,
            ticket_price: cause_ticket_price,
            tickets: vector::empty<address>(),
            winner: @0x0, 
            open: true,
        };
        vector::push_back(&mut storage_ref.causes, new_cause);

        event::emit(CauseCreatedEvent {
            user: user_addr,
            cause_id: new_cause_id,
            cause_name: cause_name,
            cause_goal: cause_goal,
            cause_ticket_price: cause_ticket_price,  
            cause_charity_percentage: cause_charity_percentage,
        });
    }

    public entry fun buy_ticket(from: &signer, to_address: address, cause_id: u64, amount: u64) acquires UserStorage {
        let from_acc_balance:u64 = coin::balance<AptosCoin>(signer::address_of(from));
        let addr = signer::address_of(from);

        assert!( amount <= from_acc_balance, E_NOT_ENOUGH_COINS);

        let to_store = borrow_global_mut<UserStorage>(to_address);
        let length = vector::length(&to_store.causes);
        let i = 0;

        while (i < length) {
            let cause = vector::borrow_mut(&mut to_store.causes, i);
            if (cause.id == cause_id) {
                let number_of_tickets = amount / cause.ticket_price;

                let j = 0;
                while (j < number_of_tickets) {
                    vector::push_back(&mut cause.tickets, addr);
                    j = j + 1;
                };
                assert!( cause.open == true, E_CAUSE_CLOSED);

                // aptos_account::transfer(from,to_address,amount);
                aptos_account::transfer(from, CONTRACT_ADDRESS, amount);

                return
            };
            i = i + 1;
        };

        assert!(false, E_CAUSE_NOT_FOUND);
    }

    #[lint::allow_unsafe_randomness]
    public entry fun close_cause(owner: &signer, cause_addr: address, cause_id: u64) acquires UserStorage{
        let owner_addr = signer::address_of(owner);
        let to_store = borrow_global_mut<UserStorage>(cause_addr);
        let length = vector::length(&to_store.causes);
        let i = 0;

        while (i < length) {
            let cause = vector::borrow_mut(&mut to_store.causes, i);
            if (cause.id == cause_id) {
                assert!( cause.open == true, E_CAUSE_CLOSED);

                let n = vector::length(&cause.tickets);
                assert!(n == 0, E_NO_TICKETS);

                let winner_idx = aptos_framework::randomness::u64_range(1, n);
                let winning_address = *vector::borrow(&cause.tickets, winner_idx);

                cause.open = false;
                cause.winner = winning_address;

                let charity_amount =  ((cause.charity_percentage as u64) * n * cause.ticket_price) / 100;
                let winner_amount = (n * cause.ticket_price) - charity_amount;

                aptos_account::transfer(owner, cause_addr,  charity_amount);
                aptos_account::transfer(owner, winning_address,  winner_amount);

                return
            };
            i = i + 1;
        };
    }

    #[view]
    public fun get_causes(user_addr: address): vector<Cause> acquires UserStorage {
        let user_storage = borrow_global<UserStorage>(user_addr);
        return user_storage.causes
    }
    // ---------------------- test --------------------

    #[test(test_user = @0x432, aptos_framework = @0x1)]
    fun test_create_and_get_causes(test_user: signer, aptos_framework: &signer) acquires UserStorage {
        use std::string;
        use std::vector;
        use std::coin;
        use std::aptos_coin::AptosCoin; 
        use std::account;
        
        let owner = signer::address_of(&test_user);
        let (burn_cap, mint_cap) = aptos_framework::aptos_coin::initialize_for_test(aptos_framework);

        let cause_name1 = string::utf8(b"First Cause");
        let cause_name2 = string::utf8(b"Second Cause");
        create_cause(&test_user, cause_name1, 1000, 10, 5, 1);
        create_cause(&test_user, cause_name2, 2000, 15, 10, 2);

        // Retrieve the lotteries
        let lotteries = get_causes(owner);

        assert!(vector::length(&lotteries) == 2, 1); 

        let first_lottery = vector::borrow(&lotteries, 0);
        assert!(first_lottery.title == cause_name1, 2);  // Verify the first lottery name

        let second_lottery = vector::borrow(&lotteries, 1);
        assert!(second_lottery.title == cause_name2, 3);  // Verify the second lottery name

        let aptos_framework_address = signer::address_of(aptos_framework);

        account::create_account_for_test(aptos_framework_address);
        let test1 = account::create_account_for_test(@0x3);
        let test2 = account::create_account_for_test(@0x4);

        coin::register<AptosCoin>(&test1);
        coin::register<AptosCoin>(&test2);

        aptos_coin::mint(aptos_framework, @0x3, 150);
        aptos_coin::mint(aptos_framework, @0x4, 50);

        let buyer_initial_balance = coin::balance<AptosCoin>(signer::address_of(&test1));
        let ticket_purchase_amount: u64 = 50;
        let ticket_purchase_amount2: u64 = 10;

        buy_ticket(&test1, owner, 1, ticket_purchase_amount);
        buy_ticket(&test2, owner, 1, ticket_purchase_amount2);

        let buyer_balance_after_purchase = coin::balance<AptosCoin>(signer::address_of(&test1));
        let expected_balance_after_purchase = buyer_initial_balance - ticket_purchase_amount;
        assert!(buyer_balance_after_purchase == expected_balance_after_purchase, 5);

        let updated_causes = get_causes(owner);
        let updated_first_cause = vector::borrow(&updated_causes, 0);

        // Check if tickets were bought successfully
        assert!(vector::length(&updated_first_cause.tickets) == 12, 6);
        
        coin::destroy_burn_cap(burn_cap);
        coin::destroy_mint_cap(mint_cap);
    }
}
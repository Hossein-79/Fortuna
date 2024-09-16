module fortuna_addr::fortuna {
    use std::string::{String};
    use std::vector;
    use std::signer;

   struct UserStorage has key {
        causes: vector<Cause>,
        last_index: u64,  
    }

     struct Cause has store, copy, drop {
        id: u64,
        title: String,
        goal: u64,
        charity_percentage: u8,
        ticket_price: u64,  
        tickets: vector<Ticket>,
        winner: address,
        open: bool,
    }

    struct Ticket has store, copy, drop {
        buyer: address, 
    }

     public entry fun create_lottery(user: &signer, cause_name: String, cause_goal: u64, cause_charity_percentage: u8, cause_ticket_price: u64) acquires UserStorage {
        let user_addr = signer::address_of(user);

        // Check if the user already has UserStorage, initialize if not
        if (!exists<UserStorage>(user_addr)) {
            let storage = UserStorage {
                causes: vector::empty<Cause>(), 
                last_index: 0,
            };
            move_to(user, storage);
        };

        let storage_ref = borrow_global_mut<UserStorage>(user_addr);

        let new_cause = Cause {
            id: storage_ref.last_index,
            title: cause_name,
            goal: cause_goal,
            charity_percentage: cause_charity_percentage,
            ticket_price: cause_ticket_price,
            tickets: vector::empty<Ticket>(),
            winner: @0x0, 
            open: true,
        };

        vector::push_back(&mut storage_ref.causes, new_cause);
        storage_ref.last_index = storage_ref.last_index + 1;
    }

    #[view]
    public fun get_lotteries(user_addr: address): vector<Cause> acquires UserStorage {
        let user_storage = borrow_global<UserStorage>(user_addr);
        return user_storage.causes
    }

    // ---------------------- test --------------------

    #[test(test_user = @0x4321)]
    fun test_create_and_get_lotteries(test_user: signer) acquires UserStorage {
        use std::string;
        use std::vector;
        // Get the admin address
        let owner = signer::address_of(&test_user);

        // Create some lotteries
        let cause_name1 = string::utf8(b"First Cause");
        let cause_name2 = string::utf8(b"Second Cause");
        create_lottery(&test_user, cause_name1, 1000, 10, 5);
        create_lottery(&test_user, cause_name2, 2000, 15, 10);

        // Retrieve the lotteries
        let lotteries = get_lotteries(owner);

        assert!(vector::length(&lotteries) == 2, 1); 

        let first_lottery = vector::borrow(&lotteries, 0);
        assert!(first_lottery.title == cause_name1, 2);  // Verify the first lottery name

        let second_lottery = vector::borrow(&lotteries, 1);
        assert!(second_lottery.title == cause_name2, 3);  // Verify the second lottery name
    }
}
import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type CreateCauseArguments = {
    user: string;
    title: string;
    goal: number;
    charity_percentage: number;
    ticket_price: number;
    cause_id: number;
};

export const createCause = (args: CreateCauseArguments): InputTransactionData => {
    // const values = {
    //     // user: args.user,
    //     cause_name: args.title,
    //     cause_goal: 0, //args.goal,
    //     cause_charity_percentage: 0, // args.charity_percentage,
    //     cause_ticket_price: 0, // args.ticket_price
    // }
    const { title, goal, charity_percentage, ticket_price, cause_id } = args;
    // console.log('🎈 data', Object.values(values))
    return {
        data: {
            function: `${import.meta.env.VITE_MODULE_ADDRESS}::fortuna::create_cause`,
            functionArguments: [title, goal, charity_percentage, ticket_price, cause_id],
        },
        sender: args.user,
    }
}


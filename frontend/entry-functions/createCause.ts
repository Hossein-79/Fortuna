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
    const { title, goal, charity_percentage, ticket_price, cause_id } = args;
    return {
        data: {
            function: `${import.meta.env.VITE_MODULE_ADDRESS}::fortuna::create_cause`,
            functionArguments: [title, Number(goal) * 1_000_000, Number(charity_percentage), Number(ticket_price) * 1_000_000, Number(cause_id)],
        },
        sender: args.user,
    }
}


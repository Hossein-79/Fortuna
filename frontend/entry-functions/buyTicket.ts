import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type BuyTicketArguments = {
    user: string;
    to_address: string;
    cause_id: number;
    amount: number;
};

export const buyTicket = (args: BuyTicketArguments): InputTransactionData => {
    const { to_address, cause_id, amount } = args;
    return {
        data: {
            function: `${import.meta.env.VITE_MODULE_ADDRESS}::fortuna::buy_ticket`,
            functionArguments: [to_address, Number(cause_id), Number(amount)],
        },
        sender: args.user,
    }
}


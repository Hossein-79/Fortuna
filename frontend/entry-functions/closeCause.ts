import { InputTransactionData } from "@aptos-labs/wallet-adapter-react";

export type CloseCauseArguments = {
    user: string;
    cause_addr: string;
    cause_id: number;
};

export const closeCause = (args: CloseCauseArguments): InputTransactionData => {
    const { cause_addr, cause_id } = args;
    return {
        data: {
            function: `${import.meta.env.VITE_MODULE_ADDRESS}::fortuna::close_cause`,
            functionArguments: [Number(cause_addr), Number(cause_id)],
        },
        sender: args.user,
    }
}


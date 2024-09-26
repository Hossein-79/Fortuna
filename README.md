# Fortuna 🎯

### Decentralized Crowdfunding Lottery Platform on the Aptos Network

Fortuna is a decentralized platform where users can create and participate in crowdfunding causes through a lottery system. It allows users to support meaningful projects, enter lotteries, and have the chance to win funds while contributing to causes that make an impact. Built on the Aptos blockchain, Fortuna guarantees transparency, security, and fairness for all participants.

## 🌟 Key Features

- **Create Causes** - Users can create and manage causes, similar to Kickstarter campaigns, where they set goals, deadlines, and charity percentages.
- **Lottery Participation** - Participants can buy tickets to support a cause, and at the end of the cause’s deadline, one winner is drawn to receive a large portion of the collected funds, while a percentage goes to the cause creator.
- **Blockchain-Powered Transparency** - All lottery processes, ticket purchases, and fund distributions are handled through smart contracts on the Aptos network.

## ⚡ Tech Stack

- **Frontend:** [React.js](https://react.dev)
- **Backend & Database:** [Supabase](https://supabase.com/) (used for database and file storage)
- **UI Design:** [shadcn/ui](https://shadcn.dev/) + [Tailwind CSS](https://tailwindcss.com/) for styling
- **Blockchain Network:** [Aptos](https://aptos.dev/)
- **Smart Contracts:** Written in Move and deployed on Aptos network to manage causes, ticket purchases, and fund distribution.
- Aptos Wallet Adapter

## 🎯 Core Functionalities

- **Cause Creation:** Users can create causes with a funding goal, description, charity percentage, and deadline.
- **Ticket Purchase:** Each cause has a dedicated lottery where users can buy tickets to support the cause and enter the draw.
- **Winner Selection:** When a cause’s deadline is reached, a random winner is selected using Aptos’ on-chain randomness, ensuring fairness and transparency.
- **Fund Distribution:** The majority of the funds raised go to the lottery winner, and a portion is reserved for the cause creator to fund the cause.

## 🚀 Getting Started

Follow these instructions to set up and run Fortuna locally on your machine.

#### Prerequisites

- Node.js (v16+)
- pnpm (for package management)
- Supabase account for backend services

#### Installation

1. Clone the repository:

```bash
git clone https://github.com/hossein-79/fortuna.git
cd fortuna
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a .env file in the root directory with the following variables:

```
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-key>
APTOS_NETWORK=mainnet/testnet
```

4. Run the development server:

```
pnpm dev
```

5. Access the application:

Open your browser and navigate to http://localhost:5173

## 🎨 Screenshots

Coming Soon: We’ll be adding screenshots of the user interface here.

## 🛠️ Smart Contracts

Fortuna uses smart contracts deployed on the Aptos network to manage all core functions such as cause creation, ticket purchases, winner selection, and fund distribution. You can view the deployed contract and interact with it via the Aptos explorer:

🔗 [Smart Contract - View on Aptos Explorer](https://explorer.aptoslabs.com/account/0x91d7eb63a3cc0051bd18cdcc8de68bbe0a51ed48aca83cab5d419bad3fe6d7c1/modules/view/fortuna/get_causes?network=testnet)

## 📖 License

This project is licensed under the MIT License - see the [LICENSE](/LICENSE) file for details.

## 🌐 Live Demo

You can check out the live version of Fortuna at:

🔗 [fortuna.placeholder.rest](🔗 fortuna.placeholder.rest)

## 🤝 Contributing

Contributions are welcome! Whether it’s a bug report, feature request, or pull request, feel free to get involved.

To contribute:

    1.	Fork the repository
    2.	Create a new branch (git checkout -b feature/my-feature)
    3.	Commit your changes (git commit -m 'Add feature')
    4.	Push the branch (git push origin feature/my-feature)
    5.	Open a pull request

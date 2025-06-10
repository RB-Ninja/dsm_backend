<p align="center">
  <img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" />
</p>

<h2 align="center">Decentralized Social Media MVP (Backend)</h2>
<p align="center">
  Built with <strong>NestJS</strong>, <strong>Prisma</strong>, <strong>PostgreSQL</strong>, and <strong>Ethereum wallet login</strong> via signed message.
</p>

---

## 🚀 Description

This is the backend service for a decentralized social media platform. Users authenticate using their **Ethereum wallet** (via signature verification) and can create posts, like, comment, and manage profiles.

### 🔐 Auth Flow:
- User signs a message using MetaMask or WalletConnect (RainbowKit).
- The signature is verified server-side using `ethers.js`.
- A JWT token is issued to maintain session state.

---

## 🛠️ Tech Stack

- **Backend Framework**: [NestJS](https://nestjs.com)
- **Database ORM**: [Prisma](https://www.prisma.io/)
- **Database**: PostgreSQL
- **Auth**: Ethereum Wallet + JWT
- **Blockchain**: `ethers.js`
- **Session Handling**: JWT strategy via `@nestjs/jwt` + Passport

---

## 📁 Project Setup

```bash
# Clone repo
git clone https://github.com/RB-Ninja/dsm_backend.git
cd dsm-backend

# Install dependencies
yarn install

# Configure environment variables
cp .env.example .env

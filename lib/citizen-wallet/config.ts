export const BREAD_COMMUNITY_CONFIG = {
  alias: "bread",
  chain_id: 100,
  json: {
    ipfs: {
      url: "https://ipfs.internal.citizenwallet.xyz",
    },
    scan: {
      url: "https://gnosisscan.io",
      name: "Gnosis Explorer",
    },
    cards: {
      "100:0xBA861e2DABd8316cf11Ae7CdA101d110CF581f28": {
        type: "safe",
        address: "0xBA861e2DABd8316cf11Ae7CdA101d110CF581f28",
        chain_id: 100,
        instance_id: "cw-discord-1",
      },
    },
    chains: {
      "100": {
        id: 100,
        node: {
          url: "https://100.engine.citizenwallet.xyz",
          ws_url: "wss://100.engine.citizenwallet.xyz",
        },
      },
    },
    tokens: {
      "100:0xa555d5344f6fb6c65da19e403cb4c1ec4a1a5ee3": {
        name: "Breadchain Community Token",
        symbol: "BREAD",
        address: "0xa555d5344f6fb6c65da19e403cb4c1ec4a1a5ee3",
        chain_id: 100,
        decimals: 18,
        standard: "erc20",
      },
    },
    plugins: [
      {
        url: "https://topup.citizenspring.earth/bread",
        icon: "https://bread.citizenwallet.xyz/uploads/logo.svg",
        name: "Top Up",
        action: "topup",
      },
      {
        url: "https://marketplace.citizenwallet.xyz/bread",
        icon: "https://bread.citizenwallet.xyz/uploads/logo.svg",
        name: "Market",
        launch_mode: "webview",
      },
    ],
    version: 5,
    accounts: {
      "100:0x940Cbb155161dc0C4aade27a4826a16Ed8ca0cb2": {
        chain_id: 100,
        paymaster_type: "cw-safe",
        paymaster_address: "0x5987e57e85014B5A56C880313580346c20a5d1c1",
        entrypoint_address: "0x7079253c0358eF9Fd87E16488299Ef6e06F403B6",
        account_factory_address: "0x940Cbb155161dc0C4aade27a4826a16Ed8ca0cb2",
      },
      "100:0xAE76B1C6818c1DD81E20ccefD3e72B773068ABc9": {
        chain_id: 100,
        paymaster_type: "cw",
        paymaster_address: "0xbE2Cb3358aa14621134e923B68b8429315368E32",
        entrypoint_address: "0xcA0a75EF803a364C83c5EAE7Eb889aE7419c9dF2",
        account_factory_address: "0xAE76B1C6818c1DD81E20ccefD3e72B773068ABc9",
      },
    },
    sessions: {
      "100:0xE2F3DC3E638113b9496060349e5332963d9C1152": {
        chain_id: 100,
        module_address: "0xE2F3DC3E638113b9496060349e5332963d9C1152",
        factory_address: "0xEd0cD3886b84369A0e29Db9a4480ADF5051c76C9",
        provider_address: "0xF3004A1690f97Cf5d307eDc5958a7F76b62f9FC9",
      },
    },
    community: {
      url: "https://breadchain.xyz/",
      logo: "https://assets.citizenwallet.xyz/wallet-config/_images/bread.svg",
      name: "Breadchain Community Token",
      alias: "bread",
      profile: {
        address: "0x6b3a1f4277391526413F583c23D5B9EF4d2fE986",
        chain_id: 100,
      },
      description:
        "BREAD is a digital community token and solidarity primitive developed by Breadchain Cooperative that generates yield for post-capitalist organizations",
      primary_token: {
        address: "0xa555d5344f6fb6c65da19e403cb4c1ec4a1a5ee3",
        chain_id: 100,
      },
      primary_card_manager: {
        address: "0xBA861e2DABd8316cf11Ae7CdA101d110CF581f28",
        chain_id: 100,
      },
      primary_account_factory: {
        address: "0x940Cbb155161dc0C4aade27a4826a16Ed8ca0cb2",
        chain_id: 100,
      },
      primary_session_manager: {
        address: "0xE2F3DC3E638113b9496060349e5332963d9C1152",
        chain_id: 100,
      },
    },
    config_location: "https://my.citizenwallet.xyz/api/communities/bread",
  },
  created_at: "2025-05-29T09:12:51.474594+00:00",
  updated_at: "2025-05-29T09:12:51.474594+00:00",
  active: true,
}

export const BREAD_TOKEN = {
  address: "0xa555d5344f6fb6c65da19e403cb4c1ec4a1a5ee3",
  symbol: "BREAD",
  decimals: 18,
  name: "Breadchain Community Token",
}

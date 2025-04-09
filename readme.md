# Cloudflare DDNS
更多介绍: https://zhuanlan.zhihu.com/p/699112858

## Setup
1. 创建 Cloudflare TOKEN ([文档](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/))
2. 通过`index.md`里的“获取所有DNS记录”获取到你需要保持DNS的记录ID(DNS_ID)
3. 把`TOKEN`, `ZONE_ID`([文档](https://developers.cloudflare.com/fundamentals/setup/find-account-and-zone-ids/)), `DNS_ID`配置到`.env`
4. 通过`docker-compose.yml`构建

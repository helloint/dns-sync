```shell Profile
TOKEN=
ZONE_ID=
DNS_ID=
```

```shell 验证Token
curl -X GET "https://api.cloudflare.com/client/v4/user/tokens/verify" \
     -H "Authorization: Bearer $TOKEN" \
     -H "Content-Type:application/json"
```
```shell 获取所有DNS记录
curl -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type:application/json" | jq
```

获取DNS Detail
```shell
curl -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$DNS_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type:application/json" | jq '.result.content'
```

更新DNS IP
```shell
curl -X PATCH "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records/$DNS_ID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type:application/json" \
  --data '"content": "1.2.3.4"'
```

获取公网IP
```shell
curl "4.ipw.cn"
```  

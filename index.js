const ZONE_ID = process.env.ZONE_ID;
const DNS_ID = process.env.DNS_ID;
const TOKEN = process.env.TOKEN;

const ipV4Url = 'https://4.ipw.cn';

const getDns = async () => {
    const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${DNS_ID}`;
    return await fetchApi(url);
};

const setDns = async (ip) => {
    const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${DNS_ID}`;
    return await fetchApi(url, {content: ip});
};

const getIp = async () => {
    return await (await fetch(ipV4Url)).text();
}


const fetchApi = async (url, payload) => {
    try {
        const options = {
            method: payload ? 'PATCH' : 'GET',
            headers: generateHeader(),
        };
        if (payload) {
            options.body = JSON.stringify(payload);
        }
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        try {
            const contentType = response.headers.get('Content-Type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (error) {
            console.error('There was a problem with your fetch operation:', error);
        }
    } catch (error) {
        console.error('There was a problem with your fetch operation:', error);
    }

    return null;
}

const generateHeader = () => {
    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${TOKEN}`,
    };
}

const main = async () => {
    if (!ZONE_ID || !DNS_ID || !TOKEN) {
        console.error(`.env value is missing, quit.`);
        return;
    }

    const ip = await getIp();
    const realIp = ip.split('%')[0];
    console.log(`realIp: ${realIp}`);

    const dns = await getDns();
    const dnsIp = dns?.result?.content;
    console.log(`dnsIp: ${dnsIp}`);

    if (dnsIp !== ip) {
        console.log(`dnsIp: ${dnsIp} doesn't match realIp: ${ip}, update it...`);
        const result = await setDns(ip);
        if (result.success) {
            console.log(`update success`);
        } else {
            console.log(`${result}`);
        }
    } else {
        console.log(`ip match, exit.`);
    }
};

main();

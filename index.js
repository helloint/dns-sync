const ZONE_ID = process.env.ZONE_ID;
const DNS_IDS = process.env.DNS_IDS?.split(',').map(id => id.trim()).filter(Boolean) || [];
const TOKEN = process.env.TOKEN;

const ipV4Url = 'https://api.ip.sb/ip';

const getDns = async (dnsId) => {
    const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${dnsId}`;
    return await fetchWithRetry(() => fetchApi(url));
};

const setDns = async (dnsId, ip) => {
    const url = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/dns_records/${dnsId}`;
    return await fetchApi(url, {content: ip});
};

const fetchWithRetry = async (fn, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            if (i === retries - 1) throw error;
            console.log(`fetch failed, retrying... (${i + 1}/${retries})`);
        }
    }
}

const getIp = async () => {
    return fetchWithRetry(async () => (await fetch(ipV4Url)).text()).then(t => t.trim());
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
    if (!ZONE_ID || DNS_IDS.length === 0 || !TOKEN) {
        console.error(`.env value is missing, quit.`);
        return;
    }

    let ip;
    try {
        ip = await getIp();
    } catch (e) {
        console.error(`failed to get ip, skip.`);
        return;
    }

    const realIp = ip.split('%')[0];

    for (const dnsId of DNS_IDS) {
        let dns;
        try {
            dns = await getDns(dnsId);
        } catch (e) {
            console.error(`failed to get dns ${dnsId}, skip.`);
            continue;
        }

        const dnsIp = dns?.result?.content;

        if (dnsIp !== ip) {
            console.log(`[${dnsId}] realIp: ${realIp}, dnsIp: ${dnsIp}`);
            console.log(`[${dnsId}] dnsIp: ${dnsIp} doesn't match realIp: ${ip}, update it...`);
            const result = await setDns(dnsId, ip);
            if (result.success) {
                console.log(`[${dnsId}] update success`);
            } else {
                console.log(`[${dnsId}] ${result}`);
            }
        } else {
            console.log(`[${dnsId}] ip match, skip.`);
        }
    }
};

main();

export default async function handler(req, res) {
    const { url, method, header, body } = req.body;
    console.log(url, method, header, body);
    const params = {
        method: method,
        headers: JSON.parse(header),
    }
    if (method === 'POST') {
        params.body = body;
    }
    const response = await fetch(url, params);
    const data = await response.text();
    console.log(data);
    res.status(200).json({ success: true, data: data });
}

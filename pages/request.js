import { useState } from "react";
import Head from "next/head";
import Image from "next/image";

export default function Request() {
    const [result, setResult] = useState("");


    async function handleSubmit(e) {
        e.preventDefault();
        setResult("");

        const res = await fetch("/api/proxy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                url: e.target.url.value,
                method: e.target.method.value,
                header: e.target.header.value,
                body: e.target.body.value,
            })
        });

        const data = await res.json();
        if (data.success) {
            setResult(data.data);
        }
    }

    return (
        <div className="container max-w-2xl mx-auto p-5">
            <Head>
                <title>请求数据转发器</title>
            </Head>
            <h1 className="py-6 text-center font-bold text-2xl"> 请求代理 </h1>
            <form className="w-full flex flex-col gap-3" onSubmit={handleSubmit}>
                <input type="text" className="flex-grow" name="url" placeholder="https://" />
                <select name="method">
                    <option value="POST">POST</option>
                    <option value="GET">GET</option>
                </select>
                <textarea name="header" className="flex-grow" rows={6} placeholder="header"></textarea>
                <textarea name="body" className="flex-grow" rows={6} placeholder="body"></textarea>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">提交</button>
            </form>
            <div className={"mt-3"}>
                <h2>返回结果</h2>
                {result !== "" && <pre className={"mt-5"}>
                    <code id={"result"} className={"text-gray-500 border w-full px-4 py-4"}>
                        {result}
                    </code>
                </pre>}
            </div>

        </div>
    )

}
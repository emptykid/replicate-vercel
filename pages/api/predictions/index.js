import Replicate from "replicate";
import {Client, Events, GatewayIntentsString} from "discord.js";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const SERVER_ID = "1063002995949830194";
const CHANNEL_ID = "1063002995949830197";
const SALAI_TOKEN = "MTA2Mjk5OTAxNjk3MzAyMTIzNg.GBkAET.Gkicz9DWQzVl8Xjj6_SMe73Nyw-RPMPUQbeeIY";

export default async function handler(req, res) {
  if (!process.env.REPLICATE_API_TOKEN) {
    throw new Error(
      "The REPLICATE_API_TOKEN environment variable is not set. See README.md for instructions on how to set it."
    );
  }

  const modelList = [
      "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf", // stable diffusion
      "9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb", // lora
      "436b051ebd8f68d23e83d22de5e198e0995357afef113768c20f0b6fcef23c8b", // midjourney diffusion
      "9936c2001faa2194a261c01381f90e65261879985476014a0a37a334593a05eb", // openjourney
  ];

  console.log(req.body.prompt);
  console.log('model: ' + req.body.model);
  const model = parseInt(req.body.model);
  if (model === 5) {
    //const data = await getRecentJobs();
    //console.log(data);
    const r = await imagine(req.body.prompt)
    console.log(`imaging status: ${r}`);
    res.statusCode = 201;
    res.end(r);
  }

  const prediction = await replicate.predictions.create({
    // Pinned to a specific version of Stable Diffusion
    // See https://replicate.com/stability-ai/stable-diffussion/versions
    //version: "db21e45d3f7023abc2a46ee38a23973f6dce16bb082a930b0c49861f96d1e5bf",
    version: modelList[model - 1],

    // This is the text prompt that will be submitted by a form on the frontend
    input: { prompt: req.body.prompt },
  });

  if (prediction?.error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ detail: prediction.error }));
    return;
  }

  res.statusCode = 201;
  res.end(JSON.stringify(prediction));
}

async function getRecentJobs() {
  const params = new URLSearchParams();
  params.append('userId', '16a52c24-3de9-493a-8ec1-835a7cf1cfd3');
  params.append('amount', '10');
  params.append('orderBy', 'new');
  params.append('jobStatus', 'completed');
  params.append('orderDirection', 'desc');
  params.append('dedupe', 'true');
  const response = await fetch(`https://www.midjourney.com/api/app/recent-jobs/?${params.toString()}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Cookie': '__Host-next-auth.csrf-token=25b72e89999ac3903988827a12476e4dab9fd20896f6bc70a287e6a8e5baaab5|a08ab5c459495656eba3295a15da71a202ea2416f513c9b55b58275579bfd371; __Secure-next-auth.callback-url=https://www.midjourney.com/account/; imageSize=medium; imageLayout_2=hover; getImageAspect=2; fullWidth=false; showHoverIcons=true; _ga=GA1.1.1140454183.1680093839; __stripe_mid=7dae7fdb-c73e-4924-867f-2b38ac3c98f63f40c7; _ga_Q0DQ5L7K0D=GS1.1.1680237615.4.1.1680237910.0.0.0; __Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..Ed4Ws0MUQrXFsW8_.q3-UMWrXH7SPKZeViGhKuhXpEl-SQH3t1100AfxY4LlCtWx3Nu8AOKbgI0UXvW2SnmT54pJ3mZUg9ZWKld09FidhbPJDGQvXNmgoPRqJJcFVJ-ii7DlO9fsrevSkZ1TCuhY9Ds2-GclxQTVecFb_WVyszfd2eAPslLyLTfaGouxjG53aRp73ybpe9mtaRy5IYCf_8BWv8bke3ESLtGZs2-_4RmfpmlBq-nKuU85uftL_nuToC3mN4rO378Jg3LKFOSc_k5FAdWLRggYtN0_F2fQ8Kg93QL62-hZaWVuCzy2QS6OoQJvHL0QmY6Xa1fRXPVKaIHBU-K0tV3A1np0wJcSLoHwn_caYDyeWq4ZsniaA0fieNzfRErSXzmX6lNbn_CAEwMaI-i_rkwm43A47HhJZZDRYKh8GOTsvRc_D-7M1Ml55NDQtqIyMcMoMQDHVYCeI3KXGj7UvGwPnMyQUtlMnrYTHdhOOiOMmYwqi7fZ1fvMz2mVjk1gcmKpSI9-mYoQo8gTemI1xfOO0QP7kMN3pEMhawDdBuDmby0AzPSPktPp0J4GfI7sQn0XzHRFOu3wNICj24e2JwGrAAQuUqVKfdDkAfnkH8zFARM4R-RfKFcTJhkTEsx4V_NvizI7laJNakvzTM4EBuk3Qc45XTzY-z5nVEDF8rCZzPUOKAPg_eXd4hiZYJV4t9Hu1lyhXlH8OdrjemfT3RaSMz-KxMebdkm3-lSj5kKC4HgSBBWRvf7hrBwh0j2_M6mB8SM6adJstNGqTMTVBbQHkLUb1OwVXmnDys9B498Ti55P9lxwHEFg2UP71xofZdh4AGpXCMAYmRaeS6-UY-xexu0C2N6uA04UCE9oXeXrZam4qOnRTVhfmvVtDjo-2xeNs8Ssmr_O4u5RBn5I62DXPCxaGRqPhVvrMq4pZlCAolM8pFYKhQ2OJEqZzInVxDmzLroof7dryRkMB1uLPz03S-FYCEU008xz1dxPwOQU9sTXvpj-Xhq9U1SO0gscATwn3dTHz178G1WPmk_6UiJKF7p7cBwnlpatgL9nmcN_pgl0-vj80M2edoa3NllMQTWXZHysyG6PbFNUTDiwuBmdqsy7qrmf0pjfOL79ezLYuT5PZtwo8Ha4HVkRt2IhwkRnMWzOZuFTZOsdyY5pw4mhaU4g-sh6-Y4nHOptNCPqSOA67MuLGyeB4Zf0RWbug32mQej9zk7j1dpRNaSx1g7p9Iz_Wuh17Mvz9xkMJ6JU_cXzhZtozbiGJpe5O3ujgsa7i-9ZPzf4afkIpVT-TXjYwV8dZpFjcuO8YdkzFmCBI3jY2NlBtEehI4D5Psek-8kPlB7k3SAcSmiaDnyVIT0_WYC5NGdcuOEszna6f9JwigGfBVbVXIwpJymIUGBWNQjsS-k8qAcUauUxGhiER7VD9MpeK_ryj5nadKoduux2Y9iS0g6XGTpoM3RBYFYa_7Mv0muoIaZNi8nzThB_dyKq4P-jt26aABl8uTau8BWpr84YGQxwKWAwutI5379AYcGKQz4FisjazSiVKGUIE9ySoQGxYnm-nU2KismNIfzRAnGOHpY2GrHQMJh0LNF42dDvcnJUBaqehWfwjOEUbbJiZfBxlwF1EH3ZEeulUY7OuVMH1sL-W7-sPuF4krmlZFwVWPW2IUnfwYqbShgMUyiVmAzgVopyX7Y81rYejA_7LOT6iuZyoXYxnlw0tIhqdRWdGzyXab4PqUwX7xqLBrikATf399_yik71KasKl1GEeTAzTqmAv9tSEai1q5XYYjYJuximlC59WjsxoSEpGOGLvSuhNchUW-nz7Q20BJ7T8cl0Fo5XkbDSheLzle01t4bT9EVUEOTUo9ErxGWg8mxR7gLa7vXCMpty6cWlY8sOsFpinAI2hIuT98HcEugF1KSgVW_6mV7xJkfudQvII1Hyh9mtmxHZeC4YtfvNQr-NZGwsfQKW2pb7wYjd83vllBYq9-PVyszO34FDPJ4OPcL_kw1Kosu2ikUtC.CSFMNHOUkrT2F8l4MoJP0w; _dd_s='
    },
  });
  return await response.json();
}

async function imagine(prompt) {
  const payload = {
    "type": 2,
    "application_id": "936929561302675456",
    "guild_id": SERVER_ID,
    "channel_id": CHANNEL_ID,
    "session_id": "0a010c9eaf31b12c8b2345c0d38bbb7c",
    "data": {
      "version": "1077969938624553050",
      "id": "938956540159881230",
      "name": "imagine",
      "type": 1,
      "options": [{ "type": 3, "name": "prompt", "value": prompt }],
      "application_command": {
        "id": "938956540159881230",
        "application_id": "936929561302675456",
        "version": "1077969938624553050",
        "default_permission": true,
        "default_member_permissions": null,
        "type": 1,
        "nsfw": null,
        "name": "imagine",
        "description": "There are endless possibilities...",
        "dm_permission": true,
        "options": [
          {
            "type": 3,
            "name": "prompt",
            "description": "The prompt to imagine",
            "required": true
          }
        ]
      },
      "attachments": []
    }
  };

  const header = {
    "authorization": SALAI_TOKEN
  };

  const formData = new FormData();
  formData.append('payload_json', JSON.stringify(payload));

  const response = await fetch("https://discord.com/api/v9/interactions", {
    method: "POST",
    headers: header,
    body: formData
  });

  return response.status;

}
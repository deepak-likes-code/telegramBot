import { openai } from "./openAi.js";

export async function generateResponse(prompt) {
  console.log(`Prompt: ${prompt}`);
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0,
      max_tokens: 100,
      top_p: 1,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    // const response = await post(openaiUrl, data, { headers: headers });
    console.log(response.data.choices[0].text);
    return response.data.choices[0].text;
  } catch (error) {
    console.error(`Error generating response: ${error}`);
    return "An error occurred while generating a response. Please try again.";
  }
}

export async function generateChatResponse(prompt) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
  });
  console.log("GPT 3.5", completion.data.choices[0].message);
  return completion.data.choices[0].message.content;
}

export async function generateImage(prompt) {
  try {
    const response = await openai.createImage({
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });
    console.log("image response", response.data);
    console.log("image response urls", response.data.data[0].url);

    return response.data.data[0].url;
  } catch (error) {
    console.error(`Error generating image: ${error}`);
    return "An error occurred while generating an image. Please try again.";
  }
}

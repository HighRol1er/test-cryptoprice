import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

const port = 3010;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

/**
 * const person = {
 *  name : fsfs
 * 
 * }
 * xrp = {
 *  binancedollar
 *  binanceWon
 *  upbit
 *  rate 
 *  volume
 *  premium
 * }
 */

const coinList = {}; 

app.get('/', async (req, res) => {
  const url = "https://api.upbit.com/v1/ticker/all?quote_currencies=KRW";
  try {
    const startTime = Date.now() // 100ms 나옴
    const response = await axios.get(url);
    const endTime = Date.now()
    console.log(`Backend API Call Duration: ${endTime - startTime} ms`);
    res.json(response.data);

  } catch (error) {
    console.log("Error from Upbit API", error);
    res.status(500).json({ message: 'Error in fetching data' });
  }
});

app.get('/binance', async(req, res) => {
  const {ticker} = req.query;
  const url = `https://www.binance.com/api/v3/ticker/price?symbol=${ticker}USDT`;

  try {
    const response = await axios.get(url);
    if (!response.data || !response.data.price) {
      // 가격 정보를 찾을 수 없을 경우
      return res.status(200).json({ price: null }); // 에러 메시지 없이 그냥 null 반환
    }
    
    const price = response.data.price; // string 

    res.json({price});
  } catch (error) {
    console.log("Error from Binance API", error);
    // res.status(500).json({ message: 'Error in fetching data' });
    res.status(200).json({ price: null });
  }
})


app.listen(port, () => {
  console.log(`Sever listen on ${port}`);
})



import React, { useEffect, useState } from 'react';
import _ from 'lodash';
/**
 * WebSocket 연결이 열리면
 * socket.onopen
 * 
 * 서버에서 메시지를 받으면
 * socket.onmessage
 * 
 * WebSocket 연결 종료 시
 * socket.onclose
 * 
 * 오류 발생시
 * socket.onerror
 */
function App() {
  const [prices, setPrices] = useState([]);
  
  const throttlingData = _.throttle((cryptoData) => {
    if (cryptoData) {
      setPrices((prevPrices) => [
        ...prevPrices,
        { coin: cryptoData.cd, price: cryptoData.tp }
      ]);
    }
  }, 5000); // 1초에 한 번만 실행
  
  useEffect(() => {
    const socket = new WebSocket('wss://api.upbit.com/websocket/v1');
    
    socket.onopen = () => {
      const subscribeMessage = JSON.stringify([
        { "ticket": "test" },        
        { "type": "ticker", "codes": ["KRW-BTC"],"is_only_realtime": true}, {"format": "SIMPLE" }
      ]);
      
      socket.send(subscribeMessage);  // 구독 요청 전송
    };
    
    socket.onmessage = async (event) => {
        try {
          const textData = await event.data.text();
          const cryptoData = JSON.parse(textData); // 텍스트 데이터를 JSON으로 파싱
          // console.log(data);
          throttlingData(cryptoData);
        } catch (error) {
          console.error('WebSocket Error', error);
        }
    };
    
    socket.onerror = (error) => {
      console.error('WebSocket Error: ', error);
    };
    
    socket.onclose = () => {
      console.log('WebSocket closed');
    };
    
    // 컴포넌트가 언마운트될 때 WebSocket 연결 종료
    return () => {
      socket.close();
    };
  }, []);

  console.log(prices);

  return (
    <div>
      <h1>Real-Time Coin Prices</h1>
      <table>
        <thead>
          <tr>
            <th>Coin</th>
            <th>Price (KRW)</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {prices.map((item, index) => (
            <tr key={index}>
              <td>{item.coin}</td>
              <td>{item.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;

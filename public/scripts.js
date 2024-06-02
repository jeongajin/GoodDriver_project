document.addEventListener('DOMContentLoaded', () => {
    // TTS 메시지를 보내는 함수
    function sendTTSMessage(message) {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(message);
            speechSynthesis.speak(utterance);
        }
    }

    // 서버에서 YOLO 결과를 주기적으로 가져와서 TTS로 읽어주는 함수
    function fetchYOLOResults() {
        fetch('http://localhost:3000/yolo-results')
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const message = `Detected objects are: ${data.join(', ')}`;
                    sendTTSMessage(message);
                }
            })
            .catch(error => console.error('Error fetching YOLO results:', error));
    }

    // 주기적으로 YOLO 결과를 가져오기 (예: 10초마다)
    setInterval(fetchYOLOResults, 10000);

    // 임의의 신호 타입을 사용한 알림 테스트
    document.getElementById('test-notification').addEventListener('click', () => {
        sendTTSMessage('우측에 보행자가 있습니다. 주의하세요.');
    });
});

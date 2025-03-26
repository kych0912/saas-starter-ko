const crypto = require('crypto');

const SteppayWebhookUtil = {
    /**
     * Steppay-Signature 헤더 값과 요청 데이터, 비밀 키를 사용하여 서명을 검증합니다.
     *
     * @param {string} signature 수신받은 'Steppay-Signature' header 값
     * @param {string} payload 수신받은 request data 전문
     * @param {string} secret 포탈에서 발급받은 secret key
     * @throws {Error} 서명이 유효하지 않을 경우 에러를 발생시킵니다.
     */
    verifySignature: function(signature, payload, secret) {
        // timestamp, payload로 encodeKeys 생성
        const timestamp = signature.split(",", 2)
            .find(part => part.startsWith("timestamp="))
            .split("=")[1];
        const encodeKey = this.encodeHmacSha256(`${timestamp}.${payload}`, secret);

        // header의 encodeKeys 추출
        const headerEncodeKeys = signature.split(',')
            .find(part => part.startsWith('key='))
            .split('key=')[1]
            .split(';');

        // header의 encodeKeys와 생성한 encodeKeys 비교
        if (!headerEncodeKeys.some(headerEncodeKey => headerEncodeKey.includes(encodeKey))) {
            throw new Error("Invalid signature");
        }
    },

    /**
     * HmacSha256로 인코딩합니다.
     *
     * @param {string} payload
     * @param {string} secret
     * @return {string}
     */
    encodeHmacSha256: function(payload, secret) {
        const hmac = crypto.createHmac('sha256', secret);
        return hmac.update(payload).digest('base64');
    }
};

module.exports = SteppayWebhookUtil;
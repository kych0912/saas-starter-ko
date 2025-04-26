const fs = require('fs');
const path = require('path');

//   {
//     'en':{
//       'signup':{
//         'title': 'Create your account',
//         'email': 'email',
//         'password': 'password',
//         'submit': 'Sign up',
//         'border': 'Already have an account?',
//         'login': 'Sign in to existing account'
//       },
//     'signin':{
//         'title': 'Create your account',
//         'email': 'email',
//         'password': 'password',
//         'submit': 'Sign up',
//         'border': 'Already have an account?',
//         'login': 'Sign in to existing account'
//       }
//     },
//     'ko':{
//       'signup':{
//         'title': '계정 생성',
//         'email': '이메일',
//         'password': '비밀번호',
//         'submit': '가입하기',
//         'border': '이미 계정이 있습니까?',
//         'login': '기존 계정 로그인'
//       },
//       'signin':{
//         'title': '계정 생성',
//         'email': '이메일',
//         'password': '비밀번호',
//         'submit': '가입하기',
//         'border': '이미 계정이 있습니까?',
//         'login': '기존 계정 로그인'
//       }
//     }
//   }

function createLocalesInLocal(header, namespace, locale){
    const localesPath = path.join(process.cwd(), 'app', 'i18n', 'locales', `${header}`);
    if(!fs.existsSync(localesPath)) {
        fs.mkdirSync(localesPath, { recursive: true });
    }

    fs.writeFileSync(path.join(localesPath, `${namespace}.json`), JSON.stringify(locale, null, 2));
}

function parseCSVLine(line){

    if(!line.includes('"')){
        return line.split(',');
    }

    const length = line.length;
    //true 일 경우 "" 안에 있는 문자열
    let inQuotes = false;
    let buffer = '';
    const result = [];

    for(let i = 0; i < length; i++){
        let current = line[i];

        if(current === '"'){
            inQuotes = !inQuotes;
            continue;
        }

        if(inQuotes){
            buffer += current;
        }else{
            if(current === ','){
                result.push(buffer);
                buffer = '';
                continue;
            }

            buffer += current;
        }
    }

    if(buffer !== '') result.push(buffer);
    return result;
}

function convertCsvToJson(){
    const csvPath = path.join(process.cwd(), 'data', 'locales.csv');
    const csvData = fs.readFileSync(csvPath, { encoding: 'utf8' });

    const normalizedData = csvData.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    const lines = normalizedData.split('\n');
    const lng = lines[0].split(',').slice(1);
    const languages  = lines.slice(1).map(line => parseCSVLine(line));
    
    return {
        lng,
        languages
    }
}

function changeJsonFormat(lng,languages,locales){
     // CSV 데이터 처리
     languages.forEach((row) => {
        if(!row[0] || row[0].trim() === '') return;
        
        const keyParts = row[0].split('.');
        if(keyParts.length !== 2) return;
        
        const namespace = keyParts[0];
        const key = keyParts[1];
        
        // 각 언어별로 네임스페이스 초기화
        lng.forEach((language, langIndex) => {
            if(!locales[language][namespace]) {
                locales[language][namespace] = {};
            }

            if(row[langIndex+1] !== undefined && row[langIndex+1] !== '') {
                locales[language][namespace][key] = row[langIndex+1];
            }
        });
    });
}

(async () => {
    const {lng, languages} = convertCsvToJson();
    const locales = {};

    // 각 언어(en, ko)에 대한 객체 초기화
    lng.forEach((header) => {
        locales[header] = {};
    });

    changeJsonFormat(lng,languages,locales);

    // 각 언어별로 파일 생성
    lng.forEach((language) => {
        const namespaces = Object.keys(locales[language]);
        namespaces.forEach((namespace) => {
            if(Object.keys(locales[language][namespace]).length > 0) {
                createLocalesInLocal(language, namespace, locales[language][namespace]);
            }
        });
    });

    console.log("생성 완료");
})();

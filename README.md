# express-statics-65kb-fail
Repro of express failing to serve assets > 65KB on `192.168.*.*` host

# Set Up
`npm i && chmod a+x ./serve*.js`


## Serving
* `npm run http` will serve a http server on port 4001, so http://localhost:4001/assets/lenna60kb.jpg should be accessible
* `npm run express` will start a express server on port 4002, so http://localhost:4002/assets/lenna60kb.jpg should be accessible
* `npm run httpHeader` will start a http server with `X-POWERED-By` header on port 4003, so http://localhost:4002/ should be accessible and serve `a.txt`.

# Content
The servers created in this repo are minimal.  Here is their content.
## Minimal `http` Server on `:4001`
```js
var http = require('http')
var serveStatic = require('serve-static')

var serveFn = serveStatic('.')
var server = http.createServer((req, res) => serveFn(req, res, () => {}));

server.listen(4001, '0.0.0.0')
```

## Minimal `express` Server on `:4002`
```js
const express = require('express')

const app = express()
app.use('/', express.static('.'))
app.listen(4002, '0.0.0.0', () => console.log("serving..."));
```

# Repro
Find your Local Network IP address (usually starts with `192.168.*.*`, on Mac can be obtained from `ifconfig | grep "inet 192"`). Let's assume it is `192.168.1.242`

Then, check the following links.
1. [Http + < 65KB = ✅] http://192.168.1.242:4001/assets/lenna60kb.jpg should work
2. [Http + > 65KB = ✅] http://192.168.1.242:4001/assets/lenna67kb.jpg should work
2. [Express + < 65KB = ✅] http://192.168.1.242:4002/assets/lenna60kb.jpg should work
2. [Express + > 65KB = ❌] http://192.168.1.242:4002/assets/lenna67kb.jpg DOESN'T work

Case #4, on Chrome gives `ERR_INVALID_HTTP_RESPONSE` Error. on FireFox and via `cURL`, you can get the content and you will see the headers are somewhere in the middle of there:

# Screenshot
<img width="1128" alt="image" src="https://user-images.githubusercontent.com/5694695/120246627-a0115100-c225-11eb-9c75-149025da5fbf.png">

## Content in FireFox
```
KH)i1F)iÀPØÒ2-$kÅL¢¡²ÒVžO›-�ZR)E-!E�ê(¢ÀRÒ
Z�(¢Š�(¢Š�ZZJZ�(¢Š�)i)h�¥”¢€
(¢€
(¢€Q@¢-%-�QE
(¢€ŠZ((¢Š�)ÔÚu�QE�--%-RÒ
Z	”RRŠb)Âš)Â‚E¢RŠb)Âš)Â˜…¥¦ÒÐHêJ( ¥ö¤¥_½@Œ½N<ƒXê0k¢ÔS(x®zNƒD8T‚¢ñT2AKM´�ìÒÓE>€RÑA¤4%%-%"Ð´”´”�†šE:Š�f)BÓ±NŒÅ!©¦7Jb#jf)æ€)ˆhà1J)éTHÖ<TlÔæ¨Í�&isIŠ(hÆhõ0HTTP/1.1 200 OK
X-Powered-By: Express
Accept-Ranges: bytes
Cache-Control: public, max-age=0
Last-Modified: Mon, 31 May 2021 21:13:50 GMT
ETag: W/"105fe-179c4469538"
Content-Type: image/jpeg
Content-Length: 67070
Date: Mon, 31 May 2021 22:20:17 GMT
Connection: keep-alive
Keep-Alive: timeout=5

ÿØÿà�JFIF���H�H��ÿá�ŒExif��MM�*������������������J�������R(�������‡i�������Z�������H������H���� ������� ������ ����������ÿí�8Photoshop 3.0�8BIM������8BIM%�����ÔŒÙ�²é€	˜ìøB~ÿÀ�"�ÿÄ�����������	
ÿÄ�µ���}�!1AQa"q2‘¡#B±ÁRÑð$3br‚	
%&'()*456789:CDEFGHIJSTUVWXYZcdefghijstuvwxyzƒ„…†‡ˆ‰Š’“”•–—˜™š¢£¤¥¦§¨©ª²³´µ¶·¸¹ºÂÃÄÅÆÇÈÉÊÒÓÔÕÖ×ØÙÚáâãäåæçèéêñòóôõö÷øùúÿÄ��������	
ÿÄ�µ��w�!1AQaq"2B‘¡±Á	#3RðbrÑ
$4á%ñ&'()*56789:CDEFGHIJSTUVWXYZcdefghijstuvwxyz‚ƒ„…†‡ˆ‰Š’“”•–—˜™š¢£¤¥¦§¨©ª²³´µ¶·¸¹ºÂÃÄÅÆÇÈÉÊÒÓÔÕÖ×ØÙÚâãäåæçèéêòóôõö÷øùúÿÛ�C�&?)&##&M7:.?\Q`_ZQXWer‘{ek‰mWX~¬€‰–›£¤£bz³¿±ž¾‘ £œÿÛ�C&!&J))JœhXhœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœœÿÝ��RÿÚ���?�µEVp¢ŠJ(�¤¢Š�(¢Š@QE�%8SiÂ¢Š(ii)h
1ºSÍ1ºS@FÕ•3TVŠ ~´Ê{u¦Uˆp¥¤´�áJ:R
)0
QM¥E&hÍ�Š( M§P…A ¦Rš‘…%-%�8RÒ
Z�)i)h
%)¤ ¢Š()E%( ¢Š(i
```

# Other Notes
* It works fine on http://127.0.0.1 and http://localhost.
* It works fine when I disable `X-Powered-By` header via `app.disable('x-powered-by');`
* Check out `http://192.168.1.242:4002/assets/a.txt` to see the content before the headers is actually the content from the actual file, not an error message or something:
```
152
0008153
0008154
0008155
0008156
0008157
0008158
0008159
0008160
0008161
0008162
0008163
0008164
0008165
0008166
0008167
0008168
0008169
0008170
0008171
0008172
0008173
0008174
0008175
0008176
0008177
0008178
0008179
0008180
0008181
0008182
0008183
0008184
0008185
0008186
0008187
0008188
0008189
0008190
0008191
0008192
HTTP/1.1 200 OK
X-Powered-By: Express
Accept-Ranges: bytes
Cache-Control: public, max-age=0
Last-Modified: Mon, 31 May 2021 22:55:43 GMT
ETag: W/"7a11ff-179c4a3db3b"
Content-Type: text/plain; charset=UTF-8
Content-Length: 7999999
Date: Mon, 31 May 2021 22:55:46 GMT
Connection: keep-alive
Keep-Alive: timeout=5

0000001
0000002
0000003
0000004
0000005
0000006
0000007
0000008
0000009
```

### Findings 6/1/2021
* The bug is also happening on httpHeader, which is using `require('http')`, `require('serve-static')`, and also `res.setHeader("X-POWERED-BY", "me-testing")`.  That eliminates `express` as the main culprit and puts the focus on how the `stream` is sending the data back on `serve-static`.
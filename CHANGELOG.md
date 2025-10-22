# Changelog

All notable changes to this project will be documented in this file. See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# 1.0.0 (2025-10-22)

### Bug Fixes

- **interceptor:** cover more cases of responses in interceptor ([756908c](https://github.com/NguyenPhuc2205/ecommerce-be/commit/756908ca7e6fab82ed4e831ef539edccb9877369))
- **ci:** fix ci workflow ([b43a661](https://github.com/NguyenPhuc2205/ecommerce-be/commit/b43a6616432202af6de6dca356a58bf6cc9486f5))
- **ci:** fix ci workflow ([29586e2](https://github.com/NguyenPhuc2205/ecommerce-be/commit/29586e2328de0a46201182e078f8beca2c480bfe))
- **ci:** fix ci workflow ([5c0173d](https://github.com/NguyenPhuc2205/ecommerce-be/commit/5c0173d5afbde5efec7a3e3aaece94aa6016234f))
- **ci:** fix ci workflow ([b6b010b](https://github.com/NguyenPhuc2205/ecommerce-be/commit/b6b010bac3bc809f06297680b6c784bf58ce06f3))
- **guard:** fix guard type any value, guard condition optional and use global auth guard in app module ([786b815](https://github.com/NguyenPhuc2205/ecommerce-be/commit/786b8151b4dec8822a3753cd428f46e578f69cdb))
- **shared:** refactor token module and try to fix ci workflow ([3f147ee](https://github.com/NguyenPhuc2205/ecommerce-be/commit/3f147ee1cd605ca9c8524ace3d139e04af679d9e))
- **auth:** remove verification code schema and import user service ([bdafc64](https://github.com/NguyenPhuc2205/ecommerce-be/commit/bdafc64ea4a5d4def3109bd94f59d93e79a4174a))
- **seeder:** separate seed action with app initialization ([98725f0](https://github.com/NguyenPhuc2205/ecommerce-be/commit/98725f0da596d0715ca65167150aa274d0666c5e))
- update import path, modify tsconfig and order of paramaters in api response builder ([ee3dc65](https://github.com/NguyenPhuc2205/ecommerce-be/commit/ee3dc65117842361b7c0cd0cb99fa6a85fe4a0ba))

### Features

- **common:** add and refactor some constants: pagination, eoles, token ([3d79881](https://github.com/NguyenPhuc2205/ecommerce-be/commit/3d79881ba2e114a4c98fd1664e137f05f616bea7))
- **guard:** add api-key guard for authentication ([7629ed5](https://github.com/NguyenPhuc2205/ecommerce-be/commit/7629ed5d5a28ac43ea63f5058639a5b8b113fe4d))
- **auth:** add auth module and simple register api ([d018b56](https://github.com/NguyenPhuc2205/ecommerce-be/commit/d018b5654d7b50fe1f4348ed890c6ae127af11bf))
- **filter:** add catch everything filter for catching exceptions ([9992626](https://github.com/NguyenPhuc2205/ecommerce-be/commit/99926268aea70e8b1f245be741f216a7dc833960))
- **guard:** add combine auth guard for multiple auth strategies ([e7531a5](https://github.com/NguyenPhuc2205/ecommerce-be/commit/e7531a5cb8052ac9f7af80059bd2aa9859e1e5f8))
- **filter:** add completed http exception filter for catching http exception ([a6913da](https://github.com/NguyenPhuc2205/ecommerce-be/commit/a6913da21ba36b6dcc498ef6578e0165d765fbf3))
- **shared:** add database, security module and refactor token module ([a171bec](https://github.com/NguyenPhuc2205/ecommerce-be/commit/a171bec00c4f7ff6bb95b3492fca118c62bf9a31))
- **email:** add email theme structure, fix path format emails folder ([bd3ce11](https://github.com/NguyenPhuc2205/ecommerce-be/commit/bd3ce116ad2da1912d547b993e9d3751269fa437))
- **verification-code:** add generate secure code using crypto and big endian format ([59b840b](https://github.com/NguyenPhuc2205/ecommerce-be/commit/59b840bd7ab426fda372dea637d3c5493713900e))
- **interceptor:** add interceptor to format standard api response ([13b5f0d](https://github.com/NguyenPhuc2205/ecommerce-be/commit/13b5f0df02c7a41c2df1150d87772dd292fc3df2))
- **auth:** add jwt auth guard to verify access token ([2e54930](https://github.com/NguyenPhuc2205/ecommerce-be/commit/2e5493076abeb55fe2f32d6a83d7923c123b355f))
- **auth:** add login, refresh-token schema, modify token service ([3c9070c](https://github.com/NguyenPhuc2205/ecommerce-be/commit/3c9070cebe1727faf9c362b091cc0c960892dd56))
- **migration:** add new field on verification codes table and generate migration ([bed982e](https://github.com/NguyenPhuc2205/ecommerce-be/commit/bed982e48dd30c4873a71b624aaf883f51e9bee4))
- **database:** add prisma interactive transaction ([5bf07fc](https://github.com/NguyenPhuc2205/ecommerce-be/commit/5bf07fc17df783b1a65eb4a5a57dcfcf2e3683fa))
- **verification-code:** add react email package ([c0b09d6](https://github.com/NguyenPhuc2205/ecommerce-be/commit/c0b09d6526bdfef2e19b7e693b92a8ed50e5a4be))
- **email:** add react-email structure for email template ([0355c71](https://github.com/NguyenPhuc2205/ecommerce-be/commit/0355c71b3f4b98aa80d0ad610d8a3ce739210332))
- **auth:** add send verification code schema and constant ([c15ae3f](https://github.com/NguyenPhuc2205/ecommerce-be/commit/c15ae3f5173e31e08c1eda9873ff2c4548717aef))
- **filter:** add simple http exception filter ([ac33ec6](https://github.com/NguyenPhuc2205/ecommerce-be/commit/ac33ec6b24c8197b1cd88c71767512d4a247d55b))
- **api:** add standard api response format ([379a1ec](https://github.com/NguyenPhuc2205/ecommerce-be/commit/379a1ecd70b7fa58a91d9c10c66d7832759f3267))
- **api:** add standard api response ([4591c1a](https://github.com/NguyenPhuc2205/ecommerce-be/commit/4591c1ada00f3d9f9d37fd8badcdd94f60c92ac7))
- **shared:** add token module and token service ([fbc0600](https://github.com/NguyenPhuc2205/ecommerce-be/commit/fbc0600085ff62b1201b8a31da8214583dd313c7))
- **middleware:** add trace id middleware to assign uuid for request ([46298ea](https://github.com/NguyenPhuc2205/ecommerce-be/commit/46298eabb082e52b94b44957ef27193a2cc1ab87))
- **utils:** add user generate images util with dicebear, ui-avatar, picsum, unsplash" ([db93050](https://github.com/NguyenPhuc2205/ecommerce-be/commit/db930507b3a331813102b6a571f1ecb113f4a1dd))
- **pipe:** add zod validation pipe and update commitlint docs, guard entry point ([f296268](https://github.com/NguyenPhuc2205/ecommerce-be/commit/f2962686c436f8bd647555be1dceecefd7c213b0))
- **shared:** initialize email module and add resend service ([f82b58c](https://github.com/NguyenPhuc2205/ecommerce-be/commit/f82b58c4ff22a9cbdc3c518e9666ae6063022f92))
- **permission:** initialize permission module ([4210847](https://github.com/NguyenPhuc2205/ecommerce-be/commit/4210847d9757ee9a3132601de2c1d0ecf5be16df))
- **app:** initialize project backend ([7150d6b](https://github.com/NguyenPhuc2205/ecommerce-be/commit/7150d6b2e18c6815a742414808832b54361c02f6))
- **verification-code:** initialize verification code module ([e9d722d](https://github.com/NguyenPhuc2205/ecommerce-be/commit/e9d722da30dd7fd5e8e0ccd6b3009bb0db6969f3))
- **config:** setup conventional commits with husky v9 and commitizen ([ded5c77](https://github.com/NguyenPhuc2205/ecommerce-be/commit/ded5c778314fccaabb72cdd5513595ac755c1129))
- **verification-code:** verify resend domain, add send email to email outside, add schemas of verification code ([3b8ff59](https://github.com/NguyenPhuc2205/ecommerce-be/commit/3b8ff593695921d5a701e67e38a07c3f86782a20))

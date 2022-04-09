### This is simple api for top rating webapp

## Used here nest.js with typegoose

# Initial start

```bash
   # Docker
   docker-compose up -d
   docker ps
   docker stop mongo
```

### Install typegoose for nestjs

```bash
npm i @typegoose/typegoose mongoose nestjs-typegoose
mongodb://admin:admin@localhost:27017/admin
```

## For measure performance and other stats use doctor.js

```bash
npm install -g clinic
npm build
clinic doctor --on-port "autocannon localhost:$PORT/api/review/byProduct/[productId]" -- node dist/main.js
```

---

## Links

- Nest.js
- Typegoose
- doctor.js
- docker

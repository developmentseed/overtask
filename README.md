# 📐 overtask 
[![npm][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/@developmentseed/overtask.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/@developmentseed/overtask

A javascript library and command line tool to grab tasks from OpenStreetMap tasking managers.

Supported tasking managers:
- Tasking Manager v2
- Tasking Manager v3

## CLI

### Installing
```bash
npm install -g @developmentseed/overtask
```

### Get all tasks from the HOTOSM Tasking manager
```bash
overtask tm3 http://tasks.hotosm.org
```

### Examples
You can pair the output of `overtask` with [jq](https://stedolan.github.io/jq/), for example
```bash
overtask tm3 http://tasks.openstreetmap.us | jq .name | grep TIGER
```
will output:

```bash
"Southwest Minnesota TIGER Alignment"
"Oklahoma County TIGER cleanup"
```

## License
MIT © Development Seed 2019
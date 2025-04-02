import { createReadStream, writeFileSync } from 'fs';
import { resolve, extname } from 'path';
import csv from 'csv-parser';

// コマンドライン引数を取得
const args = process.argv.slice(2);

if (args.length < 2) {
  console.error('使用方法: node csvToJson.js <入力CSVファイル> <出力JSONファイル>');
  process.exit(1);
}

const csvFilePath = resolve(args[0]); // 入力するCSVファイルのパス
let jsonFilePath = resolve(args[1]); // 出力するJSONファイルのパス

// 出力ファイル名の拡張子が .json でない場合、自動的に .json を付ける
if (extname(jsonFilePath) !== '.json') {
  jsonFilePath += '.json';
}

const results = [];

createReadStream(csvFilePath)
  .pipe(csv())  // CSVを解析
  .on('data', (data) => results.push(data))  // 1行ずつオブジェクトとして配列に追加
  .on('end', () => {
    // JSONファイルに書き出し
    writeFileSync(jsonFilePath, JSON.stringify(results, null, 4), 'utf-8');
    console.log(`変換が完了しました: ${jsonFilePath}`);
  })
  .on('error', (err) => {
    console.error('エラーが発生しました:', err);
  });

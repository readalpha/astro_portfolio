/*
このファイルの用途・使用方法
https://github.com/q-jutaku/coding_rule/blob/main/js.md#entryappjs
*/

/*-------- 
import文を定義
ここに必要なページのJavaScriptファイルをimportします。例：import { top } from "../pages/top";
---------*/
import { common } from "../pages/common";
import { top } from "../pages/top";

/*-------- 
下記の条件分岐を追加
この関数は、ページが読み込まれたときに自動的に実行されます。
---------*/
((d, w) => {
  // ページIDに基づいて、実行するJavaScript関数を選択します。
  switch (d.body.id) {
    // ここに必要に応じて他のページIDと関数のcaseを追加します。
    // 例：'top'のIDを持つページの場合、top()関数を呼び出します。
    case "top":
      top();
      break;
  }
  // 全てのページで共通の処理を行うcommon関数を呼び出します。
  common();
})(document, window);

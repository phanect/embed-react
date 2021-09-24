# `@geolonia/embed-react`

Geolonia Maps の地図を React アプリケーションに埋めこむためのライブラリー。

[デモや使い方を見る](https://geolonia.github.io/embed-react/?path=/story/geoloniamap--defaults)

## インストール

```
npm install --save @geolonia/embed-react
```

```
yarn add @geolonia/embed-react
```

## 使い方

```
import { GeoloniaMap } from '@geolonia/embed-react';

const Page = () => {
  return <>
    <h1>私の地図</h1>
    <GeoloniaMap
      style={{height: "200px", width: "100%"}}
      lat="35.681236"
      lng="139.767125"
      zoom="16"
    />
  </>
}
```

## Embed API と Embed React の違い

Embed API は `data-*` アトリビュートで引数を渡していますが、 React インテグレーションは `data-*` がありません。例えば、 `data-lat="35"` の代わりに、 `lat="35"` で指定してください。 `-` で別れている言葉があれば camelCase でつなげてください。(例： `data-navigation-control` が `navigationControl` になります)

Embed React は使用するコンポーネントがマウントされる時に Embed API の JavaScript が読み込まれているかを確認し、読み込まれていない場合は動的に追加します。もしサイトのほとんどのページに Geolonia Maps 地図を埋めこむ場合は、テンプレートの index.html に埋めこむことをおすすめします。

## 注意

現在のバージョンでは、 `GeoloniaMap` の props が変わると地図の再レンダリングが行われます。ポップアップ内の情報や他の props を動的に受け付けることを今後開発予定です。

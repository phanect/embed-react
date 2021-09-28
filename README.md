# Geolonia Maps Embed for React

![npm](https://img.shields.io/npm/v/@geolonia/embed-react?style=flat-square) ![GitHub Workflow Status](https://img.shields.io/github/workflow/status/geolonia/embed-react/build?style=flat-square)

[Geolonia Maps](https://geolonia.com/maps/) の地図を React のアプリケーションに埋め込むためのライブラリー。

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
      apiKey="YOUR-API-KEY"
      style={{height: "200px", width: "100%"}}
      lat="35.681236"
      lng="139.767125"
      zoom="16"
    />
  </>
}
```

Geolonia Maps をご自身のサイトに表示させるために API キーが必要となります。[詳しくはこちらをお読みください。](https://docs.geolonia.com/tutorial/002/)

## Embed API と の違い

Embed API は `data-*` アトリビュートで引数を渡していますが、 React インテグレーションは `data-*` がありません。例えば、 `data-lat="35"` の代わりに、 `lat="35"` で指定してください。 `-` で別れている言葉があれば camelCase でつなげてください。(例： `data-navigation-control` が `navigationControl` になります)

`embed-react` は使用するコンポーネントがマウントされる時に Embed API の JavaScript が読み込まれているかを確認し、読み込まれていない場合は動的に追加します。もしサイトのほとんどのページに Geolonia Maps 地図を埋め込む場合は、テンプレートの `index.html` に埋め込むことをおすすめします。[サンプルを確認する](https://github.com/geolonia/maps.geolonia.com/blob/4e431e466db71af7b4181129b3a8408ae91cd028/public/index.html#L26)

## 注意

現在のバージョンでは、 `GeoloniaMap` の props が変わると地図の再レンダリングが行われます。ポップアップ内の情報や他の props を動的に受け付けることを今後開発予定です。

# @bacons/expo-router-top-tabs

Wraps `react-native-collapsible-tab-view` and adds support for [Expo Router](https://expo.github.io/router/docs).

## Add the package to your npm dependencies

```
yarn add @bacons/expo-router-top-tabs react-native-reanimated
```

- Setup Reanimated in the `babel.config.js`. See [here](https://docs.swmansion.com/react-native-reanimated/docs/reanimated-babel-plugin/plugin-options/) for more info.

## Usage

Example in Layout Route:

```js
// app/(tabs)/_layout.tsx

import { Text, View } from "react-native";
import { TopTabs } from "@bacons/expo-router-top-tabs";

export default function CustomLayout() {
  return (
    <TopTabs screenOptions={{}}>
      <TopTabs.Header>
        <View pointerEvents="none" style={{}}>
          <Text>Header</Text>
        </View>
      </TopTabs.Header>

      <TopTabs.Screen name="index" />
    </TopTabs>
  );
}
```

Usage in child routes:

```js
// app/(tabs)/index.tsx

import { Animated } from "react-native";
import { useScrollProps } from "@bacons/expo-router-top-tabs";

export default function Screen() {
  const props = useScrollProps();

  return <Animated.ScrollView {...props}></Animated.ScrollView>;
}
```

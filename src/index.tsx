import { useFilterScreenChildren } from "expo-router/build/layouts/withLayoutContext";
import { useContextKey, useRouteNode } from "expo-router/build/Route";
import { useSortedScreens } from "expo-router/build/useScreens";
import { Screen } from "expo-router/build/views/Screen";
import React, { useCallback, useState } from "react";
import { View } from "react-native";
import {
  CollapsibleTabViewProps,
  createMaterialCollapsibleTopTabNavigator,
  useCollapsibleScene,
} from "react-native-collapsible-tab-view";

const Nav = createMaterialCollapsibleTopTabNavigator().Navigator;
const TopTabsInternal = Nav;

const useReactNativeViewHeight = () => {
  const [height, setHeight] = useState(0);
  const onLayout = useCallback((event) => {
    const { height } = event.nativeEvent.layout;
    setHeight(height);
  }, []);
  return { height, onLayout };
};

/**
 * A collapsible tab view that can be used as a Layout Route.
 *
 * Example in Layout Route:
 *
 * ```js
 * // app/(tabs)/_layout.tsx
 *
 * import { StyleSheet, Text, View } from "react-native";
 * import { TopTabs } from "../../etc/collapsible";
 *
 * export default function CustomLayout() {
 *   return (
 *     <TopTabs>
 *       <TopTabs.Header>
 *         <View pointerEvents="none" style={{ ... }}>
 *           <Text>Header</Text>
 *         </View>
 *       </TopTabs.Header>
 *
 *       <TopTabs.Screen name="index" />
 *     </TopTabs>
 *   );
 * }
 * ```
 *
 * Usage in child routes:
 *
 * ```js
 * // app/(tabs)/index.tsx
 *
 * import { Animated, StyleSheet, Text } from "react-native";
 * import { useScrollProps } from "../../etc/collapsible";
 *
 * export default function Screen() {
 *   const props = useScrollProps();
 *
 *   return (
 *     <Animated.ScrollView {...props}>
 *       // ...
 *     </Animated.ScrollView>
 *   );
 * }
 * ```
 * @param param0
 * @returns
 */
export const TopTabs = ({
  children,
  options,
  ...props
}: {
  children?: React.ReactNode;
  options?: Partial<CollapsibleTabViewProps<any>>;
}) => {
  // Allows adding Screen components as children to configure routes.
  const { screens, children: otherChildren } = useFilterScreenChildren(
    children,
    { isCustomNavigator: true }
  );

  const header = otherChildren.find((child) => child.type === Header);

  if (!header) {
    throw new Error("TopTabs must have a TopTabs.Header child");
  }

  const { height, onLayout } = useReactNativeViewHeight();
  const renderHeader = useCallback(() => {
    return (
      <View pointerEvents="box-none" onLayout={onLayout}>
        {header}
      </View>
    );
  }, [header, onLayout]);

  const contextKey = useContextKey();
  const sorted = useSortedScreens(screens ?? []);

  if (!sorted.length) {
    console.warn(`Layout at "${contextKey}" has no children.`);
    return null;
  }

  return (
    <TopTabsInternal
      {...props}
      collapsibleOptions={{
        headerHeight: height,
        renderHeader,
        disableSnap: true,
        ...options,
      }}
      children={sorted}
    />
  );
};

TopTabs.Screen = Screen;

function Header({ children }) {
  return children;
}

TopTabs.Header = Header;

/** Get the scroll props for a child route of a collapsible tabs layout route. */
export function useScrollProps() {
  const route = useRouteNode();
  return useCollapsibleScene(route!.route);
}

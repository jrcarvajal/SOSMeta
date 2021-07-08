import React, { useContext } from 'react';
import { StyleSheet, View, Dimensions, FlatList, Text } from 'react-native';
import { useInfiniteQuery } from 'react-query';
import EmergencyCard from './EmergencyCard';
import Select from '../common/SelectCity';
import Spinner from '../common/Spinner';
import CityContext from '../../context/cityContext';
import { theme } from '../../theme';
import { BASE, EMERGENCIES } from '../../endpoints';
import { normalize } from '../../utils/fonts';

const EmergencyList = (props) => {
  const { cityId } = useContext(CityContext);
  const { isLoading, fetchNextPage, data } = useInfiniteQuery(
    ['emergencies', cityId],
    ({ pageParam = `${BASE}${EMERGENCIES}?city=${cityId}` }) =>
      fetch(pageParam).then((res) => res.json()),
    {
      getPreviousPageParam: (firstPage) => {
        return firstPage.previous ?? false;
      },
      getNextPageParam: (lastPage) => {
        return lastPage.next ?? false;
      },
    },
  );

  const emergencies = data?.pages.flatMap((page) => page.results);

  return (
    <View style={styles.container}>
      <Select />
      {isLoading ? (
        <Spinner />
      ) : emergencies.length > 0 ? (
        <FlatList
          data={emergencies}
          keyExtractor={(item) => item.id + ''}
          renderItem={({ item }) => <EmergencyCard {...item} key={item.id} />}
          onEndReached={fetchNextPage}
          ListFooterComponent={<View style={{ height: 80 }} />}
        />
      ) : (
        <Text style={styles.empty}>No hay emergencias</Text>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    paddingBottom: 2,
  },
  containerList: {
    flex: 1,
  },
  empty: {
    padding: 20,
    textAlign: 'center',
    fontSize: normalize(20),
    color: theme.colors.text,
  },
});
export default EmergencyList;

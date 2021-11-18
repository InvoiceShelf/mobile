import {StyleSheet} from 'react-native';
import {fonts} from '@/styles';

export default styles = StyleSheet.create({
  itemContainer: (theme, disabled) => ({
    borderWidth: 1,
    borderColor: theme?.input?.borderColor,
    ...(disabled && {
      opacity: 0.7
    })
  }),
  itemLeftTitle: theme => ({
    fontSize: 15,
    fontFamily: fonts.regular,
    color: theme?.listItem?.fifth?.color,
    textAlign: 'left'
  }),
  itemLeftSubTitle: theme => ({
    color: theme?.listItem?.fourth?.color,
    fontSize: 13,
    includeFontPadding: false
  }),
  itemRightTitle: theme => ({
    fontFamily: fonts.regular,
    fontSize: 18,
    color: theme?.listItem?.secondary?.color,
    textAlign: 'left'
  }),
  itemLeftSubTitleLabel: {
    marginLeft: -6
  },
  label: hasItem => ({
    paddingBottom: -1,
    paddingTop: 12,
    ...(hasItem && {
      paddingBottom: 7
    })
  })
});

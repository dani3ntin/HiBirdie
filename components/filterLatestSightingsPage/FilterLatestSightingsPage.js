import { Modal, View, Text, Pressable, StyleSheet } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import { useState } from 'react'
import { maximumDaysOptions } from './MapKeyValueFilter'
import { maximumDistanceOptions } from './MapKeyValueFilter'
import { getMaximumDaysOptionValueFromKey } from './MapKeyValueFilter'
import { getMaximumDistanceOptionValueFromKey } from './MapKeyValueFilter'

function FilterLatestSightingsPage(props) {
    const [maximumDaysSelected, setMaximumDaysSelected] = useState('')
    const [maximumDistanceSelected, setMaximumDistanceSelected] = useState('')

    function closeModal() {
        props.updateFilterData(maximumDaysSelected, maximumDistanceSelected)
        props.closeModal();
    }

    function handleModalPress(e) {
        e.stopPropagation();
    }

  return (
    <Modal
      visible={props.visible}
      animationType="slide"
      transparent={true}
      onRequestClose={closeModal}
    >
      <Pressable style={styles.modalContainer} onPress={closeModal}>
        <View style={styles.overlay} />
        <View style={styles.modalContent} onStartShouldSetResponder={handleModalPress}>
            <View style={styles.maximumSightingDays}>
                <Text>Maximum sighting days:</Text>
                <SelectList data={maximumDaysOptions} setSelected={setMaximumDaysSelected} defaultOption={getMaximumDaysOptionValueFromKey(props.maximumDaysDefault, 10)}/>
            </View>
            <View style={styles.maximumSightingDays}>
                <Text>Maximum distance from your location (in kilometers):</Text>
                <SelectList data={maximumDistanceOptions} setSelected={setMaximumDistanceSelected} defaultOption={getMaximumDistanceOptionValueFromKey(props.maximumDistanceDefault, 10)}/>
            </View>
        </View>
      </Pressable>
    </Modal>
  );
}

export default FilterLatestSightingsPage;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black color
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  button: {
    backgroundColor: 'lightblue',
    padding: 12,
    margin: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  maximumSightingDays: {
    paddingBottom: 20
  }
});

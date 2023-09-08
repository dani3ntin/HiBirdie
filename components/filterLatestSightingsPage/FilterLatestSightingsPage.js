import { Modal, View, Text, Pressable, StyleSheet } from 'react-native'
import { SelectList } from 'react-native-dropdown-select-list'
import { useState } from 'react'
import { maximumDaysOptions } from './MapKeyValueFilter'
import { maximumDistanceOptions } from './MapKeyValueFilter'
import { sortingOptions } from './MapKeyValueFilter'
import { sortingCriterionOptions } from './MapKeyValueFilter'
import { getMaximumDaysOptionValueFromKey } from './MapKeyValueFilter'
import { getMaximumDistanceOptionValueFromKey } from './MapKeyValueFilter'
import { getSortingOptionValueFromKey } from './MapKeyValueFilter'
import { getSortingCriterionOptionValueFromKey } from './MapKeyValueFilter'
import { useGlobalContext } from '../globalContext/GlobalContext'

function FilterLatestSightingsPage(props) {
    const { globalVariable, setGlobalVariable } = useGlobalContext()
    const [selectedMaximumDays, setSelectedMaximumDays] = useState('')
    const [selectedMaximumDistance, setSelectedMaximumDistance] = useState('')
    const [sortingSelected, setSortingSelected] = useState('')
    const [sortingSelectedCriterion, setSortingSelectedCriterion] = useState('')

    function closeModal() {
        props.updateFilterData(selectedMaximumDays, selectedMaximumDistance, sortingSelected, sortingSelectedCriterion)
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
          <Text style={styles.title}>Sorting criteria:</Text>
          <View style={styles.maximumSightingDays}>
              <Text style={styles.titleFilter}>Order sighting by:</Text>
              <SelectList data={sortingOptions} setSelected={setSortingSelected} defaultOption={getSortingOptionValueFromKey(props.sortingDefault)} />
          </View>
          <View style={styles.maximumSightingDays}>
              <Text style={styles.titleFilter}>Criterion:</Text>
              <SelectList data={sortingCriterionOptions} setSelected={setSortingSelectedCriterion} defaultOption={getSortingCriterionOptionValueFromKey(props.sortingCriterionDefault)} />
          </View>
          <Text style={styles.title}>Filters:</Text>
          <View style={styles.maximumSightingDays}>
              <Text style={styles.titleFilter}>Maximum sighting days:</Text>
              <SelectList data={maximumDaysOptions} setSelected={setSelectedMaximumDays} defaultOption={getMaximumDaysOptionValueFromKey(props.maximumDaysDefault)} />
          </View>
          <View style={styles.maximumSightingDays}>
              <Text style={styles.titleFilter}>Maximum distance from your location (in kilometers):</Text>
              <SelectList data={maximumDistanceOptions} setSelected={setSelectedMaximumDistance} defaultOption={getMaximumDistanceOptionValueFromKey(props.maximumDistanceDefault)}/>
          </View>
          <Pressable 
            style={({ pressed }) => [
                styles.closeButton,
                {backgroundColor: globalVariable.buttonColor},
                pressed && { backgroundColor: '#929292' }
            ]}
            onPress={closeModal}
          >
            <Text style={styles.buttonText}>Close</Text>
          </Pressable>
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
    paddingBottom: 20,
  },
  titleFilter: {
    paddingBottom: 5,
  },
  title: {
    paddingBottom: 15,
    fontWeight: 'bold',
    fontSize: 18,
  },
  closeButton: {
    bottom: 20,
    width: 150,
    height: 70,
    borderWidth: 2,
    paddingVertical: 10,
    borderColor: 'black',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'black',
    fontSize: 18,
  },
});

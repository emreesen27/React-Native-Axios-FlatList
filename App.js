import React, {Component} from 'react';
import {StyleSheet, SafeAreaView} from 'react-native';   
import MyFlatList from './src/MyFlatList';

export default class App extends Component{

  render(){
		return( 
			<SafeAreaView style={styles.container}>
				<MyFlatList/>
			</SafeAreaView>
		);
  }

}

const styles = StyleSheet.create({
	container: {
		flex:1,
	},
});

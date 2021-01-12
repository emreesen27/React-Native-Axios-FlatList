import React, {Component} from 'react';
import {
	StyleSheet,
	View,
	Text,
	SafeAreaView,
	FlatList,
	Image,
	TouchableOpacity,
	ActivityIndicator,
	TextInput } from 'react-native';   
import axios from 'axios';

export default class MyFlatList extends Component{

	state = {
		text: '',
		loading: true,
		page: 1,
		contacts: [],
		allContacts: [],
	};

	constructor(props){
		super(props);
		this.duringMomentum = false;
	}

	componentDidMount(){
		this.getContacts();
	}

	getContacts = async () => {

		this.setState({
			loading:true,
		})

		const {data: { results: contacts }} = await axios.get(`https://randomuser.me/api/?results=20&page=${this.state.page}`);
		const users = [...this.state.contacts, ...contacts];
		this.setState({contacts: users, allContacts: users, loading: false,});
	};

   renderContactsItem = ({item, index}) => {
    return(
			<TouchableOpacity
				style={[styles.itemContainer,{backgroundColor: index %2 == 0 ? 'white' : '#f7f7f7'}]}>
			<Image style={styles.avatar}
			source={{uri: item.picture.thumbnail}}/>
				<View style={styles.textContainer}>
					<Text style={styles.name}>{item.name.first} {item.name.last}</Text>
					<Text>{item.location.state}</Text>
				</View>
			</TouchableOpacity>
    );
  }

  renderHeader = () => {
	  const {text} = this.state;
	  return(
		  <View style={styles.searchContainer}>
			  <TextInput style={styles.searchInput} 
				onFocus={() => this.duringMomentum = true}
				onBlur={() => this.duringMomentum = false}
				onChangeText = {text => {
					this.setState({text});
					this.searchFilter(text);
				}}
				placeholder='Search' 
				value={text}>
			</TextInput>
		  </View>
	  );
  }

  renderFooter = () => {
	  if(this.state.loading){
		return(
			<View style={{paddingVertical: 20}}>
			  <ActivityIndicator size='large' color='blue'/>
			</View>
		);
	  }
	  else {
		  return null;
	  }
  }

  loadMore = () => {
	if(!this.duringMomentum){
	this.setState({
		page: this.state.page + 1,
		}, () => {this.getContacts();
		});
		this.duringMomentum = false;
	}
  };
 
  searchFilter = text => {
	const newData = this.state.allContacts.filter(item => {
		const listItem = `${item.name.first.toLowerCase()} ${item.name.last.toLowerCase()} ${item.location.state.toLowerCase()}`
		return listItem.indexOf(text.toLowerCase()) > -1;
	});

	this.setState({contacts:newData});
  }

  render(){
	return( 
		<SafeAreaView style={styles.container}>
			<FlatList
				ListHeaderComponent = {this.renderHeader}
				ListFooterComponent = {this.renderFooter}
				onEndReached = {this.loadMore}
				onEndReachedThreshold={0.2}
				data={this.state.contacts}
				renderItem = {this.renderContactsItem}
				keyExtractor={item => item.login.uuid}>
			</FlatList>
		</SafeAreaView>
	);
  }

}

const styles = StyleSheet.create({	
	itemContainer: {
		flex: 1,
		flexDirection: 'row',
		paddingVertical: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#eee'
	},
	avatar: {
		width: 50,
		height: 50,
		borderRadius: 25,
		marginHorizontal: 10,
	},
	textContainer: {
		justifyContent: 'space-around'
	},
	name: {
		fontSize: 16,
	},
	searchContainer: {
		padding: 10,
	},
	searchInput: {
		fontSize: 16,
		backgroundColor: '#f7f7f7',
		borderBottomWidth: 0.5,
		padding: 10,	
	}

});

import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity, Image } from 'react-native';
import *as Permissions from 'expo-permissions'
import {BarCodeScanner} from 'expo-barcode-scanner'
import { TextInput } from 'react-native-gesture-handler';
import * as firebase from 'firebase'
import db from '../config.js'
export default class TransactionScreen extends React.Component
{
    constructor()
    {
        super()
        this.state={
            hasCamPermission:null,
            scanned:false,
            scannedData:'',
            buttonState:"normal",
            scannedBookid:'',
            scannedSstudentid:'',
            transactionMessage:" "


        }
    }
    getCameraPermissions=async(id)=>{
        
           const{status}=await Permissions.askAsync(Permissions.CAMERA);
           this.setState=({
               hasCamPermission:status==="granted",
               scanned:false,
               buttonState:id,
               scanned:false
           })
        }

        handleBarCodeScanner=async({type,data})=>{
            this.setState={
                scannedData:data,
                scanned:true,
                buttonState:"normal"
            }
        }
    
        handleTransaction=()=>{    
            var transMsg
            db.collection("books").doc(this.state.scannedBookid).get()
            .then((doc)=>{
                console.log(doc.data())
                var book=doc.data()
                if(book.bookAvailability)
                {
                    this.initiateBookissue();
                    transMsg="Book Issued"
                }
                else{
                    this.initiateBookReturn();
                    tensMsg="Book Returned"
                }
            })    
            this.setState({
                transactionMessage:transMsg
            })    
        }

        initiateBookIssue = async ()=>{
            //add a transaction
            db.collection("transaction").add({
              'studentId' : this.state.scannedStudentId,
              'bookId' : this.state.scannedBookId,
              'data' : firebase.firestore.Timestamp.now().toDate(),
              'transactionType' : "Issue"
            })
        
            //change book status
            db.collection("books").doc(this.state.scannedBookId).update({
              'bookAvailability' : false
            })
            //change number of issued books for student
            db.collection("students").doc(this.state.scannedStudentId).update({
              'numberOfBooksIssued' : firebase.firestore.FieldValue.increment(1)
            })
             Alert.alert("Book issued")
        
            this.setState({
              scannedStudentId : '',
              scannedBookId: ''
            })
          }


          initiateBookReturn = async ()=>{
            //add a transaction
            db.collection("transactions").add({
              'studentId' : this.state.scannedStudentId,
              'bookId' : this.state.scannedBookId,
              'date'   : firebase.firestore.Timestamp.now().toDate(),
              'transactionType' : "Return"
            })
        
            //change book status
            db.collection("books").doc(this.state.scannedBookId).update({
              'bookAvailability' : true
            })
        
            //change book status
            db.collection("students").doc(this.state.scannedStudentId).update({
              'numberOfBooksIssued' : firebase.firestore.FieldValue.increment(-1)
            })
            Alert.alert("Book Returned")
        
            this.setState({
              scannedStudentId : '',
              scannedBookId : ''
            })
          }
        
    render()
    {
        const hasCameraPermissions=this.state.hasCamPermission
       if(this.state.hasCamPermission &&this.state.buttonState!=="normal")
        {
            return(
               // <Text>
              //      {this.state.hasCamPermission===true?this.state.scannedData:"request for Permissions"}
               // </Text>
               <BarCodeScanner
                 onBarCodeScanned={this.state.scanned?"No data yet" :this.handleBarCodeScanner}
               
               />
            )
        }
        else 
        {
        return(
            <View style={styles.container}>
                <view>
                    <Image
                    source={require("../assets/bookLogo.jpg")}
                    style={{width:200,height:200}}/>
                    <Text style={{textAlign:"center",fontSize:30}}>Willy</Text> 
                </view>
                
            
            <View style={styles.container}>
                <View style={styles.inputView}>
                    <TextInput
                    style={styles.inputBox}
                    placeholder="Book Id"
                    value={this.state.scannedBookid}
                    />
                 <TouchableOpacity style={styles.scanButton}
                 onPress={()=>{
                     this.getCameraPermissions("BookId")
                 }}>
                   <Text style={styles.buttonText}>Scan</Text>
                   </TouchableOpacity>
                </View>
                <View style={styles.inputView}>
                <TextInput
                    style={styles.inputBox}
                    placeholder="Student Id"
                    value={this.state.scannedSstudentid}
                    />
                 <TouchableOpacity style={styles.scanButton}
                 onPress={()=>{
                    this.getCameraPermissions("StudentId")
                }}
                 >
                   <Text style={styles.buttonText}>Scan</Text>
                   </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.submitButton}
                onPress={async()=>{this.handleTransaction()}}>
                    <Text style={styles.submittButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
           
        </View>

        )
    }
  }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    displayText:{
      fontSize: 15,
      textDecorationLine: 'underline'
    },
    scanButton:{
      backgroundColor: '#2196F3',
      padding: 10,
     // marginLeft: 30,
      width:80,
      height:40,
      borderWidth:1.5,
      borderLeftWidth:0,
      textAlign:"center",
      justifyContent:"center",
     // textAlignVertical:"center"
    },
    buttonText:{
      fontSize: 20,
    },
    buttonText:{
        fontSize:15,
        textAlign:"center",
        marginTop:15
    },
    inputView:{
        flexDirection:"row",
        margin:20
    },
    inputBox:{
        width:180,
        height:40,
        borderWidth:2.5,
        borderRightWidth:0,
        fontSize:20,
        textAlign:"center"
    },
    submitButton:{
        backgroundColor:'gold',
        width:100,
        height:50
    },
    submittButtonText:{
        pading:10,
        textAlign:'center',
        fontSize:20,
        fontWeight:"bold",
        color:"white"
    }
  });
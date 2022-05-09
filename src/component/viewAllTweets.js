import React, { Component } from 'react'
import TweetDataService from "../services/TweetDataService";
import "./ViewTweets.css";
import { AiFillLike, AiOutlineFieldTime } from "react-icons/ai";
import Button from 'react-bootstrap/Button';
import Form from "react-validation/build/form";
import Input from "react-validation/build/input";
import AuthService from "../services/auth.service";
import {withRouter} from "react-router-dom";

class ViewMytweetComponent extends Component {

    constructor(props) {
        super(props)
        this.onChangeReply = this.onChangeReply.bind(this);
        this.state = {
            Tweet: [],
            reply: "",
            user: AuthService.getCurrentUser()
        }

        this.deleteTweet = this.deleteTweet.bind(this);

    }

    updateTweet(Tweetloginid,tweetId){
        const {user} = this.state;
        var loginId = user.userId;
        if(Tweetloginid === loginId){
        this.props.history.push(`/update/${tweetId}`);
        window.location.reload();
        }
        else{
            alert(" U Cannot Update Others Tweet...Press  OK and Continue Tweet..Thank You!!");
        }
    }

    replyViewTweet(Tweetloginid,Tweetuuid){
        this.props.history.push(`/view/${Tweetuuid}/${Tweetloginid}`);
        window.location.reload();
    
    }



    likeTweet(tweetId) {
        const {user} = this.state;
        var loginId = user.loginId;
        TweetDataService.likeATweet(loginId, tweetId).then(
            () => {

                this.componentDidMount();
            });

    }

    replyTweet(tweetId) {
        const {user} = this.state;
        var loginId = user.loginId;
        TweetDataService.replyTweet(loginId, tweetId, this.state.reply).then(
            () => {
              
                window.location.reload();
            });
    }

    deleteTweet(Tweetloginid,tweetId) {
        console.log(Tweetloginid);
        console.log(tweetId);
        const {user} = this.state;
        var loginId = user.loginId;
        console.log(loginId);
      
            console.log('inside');
            TweetDataService.deleteATweet(Tweetloginid, tweetId).then((res) => {
                this.setState({
                    Tweet: this.state.Tweet.filter(Tweet =>
                        Tweet.tweetId !== tweetId)
                });
            });
       
    }

    componentDidMount() {
        TweetDataService.getAllTweet().then((res) => {
            this.setState({ Tweet: res.data });
        });
    }

    onChangeReply(e) {
        this.setState({
          reply:e.target.value
        });
    }


    render() {
        return (

            <div className="row">
                <table id="table1" className="table table-hover table-dark">
                    <tbody className="myTweetbody">
                        {
                            this.state.Tweet.map(
                                Tweet =>
                                    <tr key={Tweet.tweetId}>
                                       
                                        <td> {Tweet.tweet} <br></br><Button onClick={() => this.likeTweet(Tweet.tweetId)} variant="outline-info"><AiFillLike /></Button> {Tweet.like}<br></br><AiOutlineFieldTime /> {Tweet.timestamp}</td>
                                        
                                        <td>
                                            <div>
                                                <Form>
                                                    <Input id="t3" type="textbox" className="replybox" name={Tweet.tweetId} placeholder="commnet here.." onChange={this.onChangeReply} value={this.state[Tweet.tweetId] || ""}></Input>
                                                    <Button onClick={() => this.replyTweet(Tweet.tweetId)}>Reply</Button>
                                                </Form>
                                            </div>
                                            
                                        </td>
                                        <td>
                                            <button onClick={ () => this.updateTweet(Tweet.userId,Tweet.tweetId)} className="btn btn-info">Update </button>
                                            <button style={{ marginLeft: "10px" }} onClick= {() => this.deleteTweet(Tweet.userId,Tweet.tweetId)} className="btn btn-danger">Delete </button>
                                            <button style={{ marginLeft: "10px" }} onClick={ () => this.replyViewTweet(Tweet.userId,Tweet.tweetId)} className="btn btn-info">View Replies </button>
                                        </td>
                                    </tr>
                            )
                        }

                    </tbody>
                </table>

            </div>
        )
    }
}

export default withRouter(ViewMytweetComponent)
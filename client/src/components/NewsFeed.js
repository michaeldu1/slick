import React, { Component } from 'react'
import { Container, ListGroup, ListGroupItem, Button } from 'reactstrap'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
import { connect } from 'react-redux';
import { getItems, deleteItem, likeItem } from '../actions/itemActions'
import PropTypes from 'prop-types';

class ShoppingList extends Component {
	static propTypes = {
		getItems: PropTypes.func.isRequired,
		item: PropTypes.object.isRequired,
		isAuthenticated: PropTypes.bool,
		auth: PropTypes.object.isRequired
	}

	componentDidMount() {
		this.props.getItems();
	}

	onDeleteClick = (id) => {
		this.props.deleteItem(id)
	}

	onLikeClick = (id) => {
		console.log("onlikeclick hit")
		const newItem = {
			likes: 1,
			id: id
		}
		this.props.likeItem(newItem)
	}

	onHeartClick = (event, props) => {
    this.setState({ checked: !this.props.checked });
  }

	render() {
		const { items } = this.props.item;
		const { user } = this.props.auth;
		console.log("items are", user)
		return(
			<Container>
				<ListGroup>
					<TransitionGroup className="shopping-list">
						{items.map(({ _id, description, img, username, likes }) => (
							<CSSTransition key={_id} timeout={500} classNames="fade">
								<ListGroupItem>
									<div>
										<span style={{color: "#5382cf"}}>{username}</span>
										{this.props.isAuthenticated && user.username === username ? 								
											<Button className="remove-btn" color="danger" size="sm" onClick={this.onDeleteClick.bind(this, _id)}>
												&times;
											</Button> :
											null
										}
									</div>
									<div className="images" >{img ? <img src={img} width="100%" height="100%"/> : null}</div>
									<div>
										{this.props.isAuthenticated ? 
										<Button className="mr-2" variant="dark" size="sm" onClick={this.onLikeClick.bind(this, _id)}>
											Like
										</Button> :
										null
										}
										<span className="like-button"> {likes} likes</span>
									</div>
									<div>Description:</div>
									<span className="descr">{description}</span>				
								</ListGroupItem>
							</CSSTransition>
						))}
					</TransitionGroup>
				</ListGroup>
			</Container>
		);
	}
}

const mapStateToProps = (state) => ({
	item: state.item, 
	isAuthenticated: state.auth.isAuthenticated,
	auth: state.auth,
	likes: 0
})

export default connect(mapStateToProps, { getItems, deleteItem, likeItem })(ShoppingList);
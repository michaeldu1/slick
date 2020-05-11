import React, { Component } from 'react';
import {
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup, 
    Label,
    Input
} from 'reactstrap';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addItem } from '../actions/itemActions';
// import ImageUploader from 'react-images-upload';

class ItemModal extends Component {
		constructor(props) {
			super(props);
			this.state = {
				modal: false,
				name: '',
				image: null
			}
		}
		
		static propTypes = {
			isAuthenticated: PropTypes.bool,
			auth: PropTypes.object.isRequired
		}

    toggle = () => {
			this.setState({
					modal: !this.state.modal
			});
		}
		

		fileChangedHandler = event => {
			this.setState({ selectedFile: this.toBase64(event.target.files[0]) })
		}

    onChange = (e) => {
      this.setState({[e.target.name]: e.target.value})
    }

    onSubmit = (e) => {
			const { username } = this.props.auth.user;
			e.preventDefault();
			const newItem = {
					name: this.state.name,
					img: this.state.image, 
					username: username
			}

			// add item via add item action
			this.props.addItem(newItem);

			// close modal
			this.toggle();
		}

		handleChangeImage = (evt) => {
			console.log("Uploading");
			var self = this;
			var reader = new FileReader();
			var file = evt.target.files[0];
	
			reader.onload = function(upload) {
				self.setState({
						image: upload.target.result
				});
			};
			reader.readAsDataURL(file);    
			setTimeout(function() {
				console.log(self.state.image);
			}, 1000);
		}
	
    render(){
			return(
				<div>
					{ this.props.isAuthenticated ? 					
						<Button color="dark" style={{marginBottom: '2rem'}} onClick={this.toggle}> 
							Share your cut!
						</Button> :
						<h4 className="mb-3 ml-4">
							Feed
						</h4>
					}

					<Modal isOpen={this.state.modal} toggle={this.toggle} >
						<ModalHeader toggle={this.toggle}>Upload Post</ModalHeader>
						<ModalBody>
							<input ref="file" type="file" name="file" 
								className="upload-file" 
								id="file"
								onChange={this.handleChangeImage}
								encType="multipart/form-data" 
								required
							/>
							{this.state.image ? <img src={this.state.image} width="100" height="100"/> : null}
							<Form onSubmit={this.onSubmit}>
								<FormGroup>
									<Label for="item"> 
										Description
									</Label>
									<Input type="text" name="name" id="item" placeholder="Clipper length, color, style, etc." onChange={this.onChange}/>
									<Button color="dark" style={{marginTop: '2rem'}} block >
										Post
									</Button>
								</FormGroup>
							</Form>
						</ModalBody>
					</Modal>
				</div>
			);
    }
}
const mapStateToProps = state => ({
		item: state.item,
		isAuthenticated: state.auth.isAuthenticated,
		auth: state.auth
})

export default connect(mapStateToProps, { addItem })(ItemModal)
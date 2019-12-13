import React, {Component} from 'react';
import {connect} from 'react-redux';

import Aux from '../../hoc/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
import * as burgerBuilderActions from '../../store/actions/index'


class BurgerBuilder extends Component {

    state = {
        
      
        
        purchasing: false,
        
    }
    componentDidMount = () => {
        
        this.props.onInitIgredients()
       
    }

    updatePurchaseState (ingredients) {
     
        const sum = Object.keys(ingredients)
        
        .map(igKey => {
            return ingredients[igKey]
        }).reduce((sum,el) => {
            return sum + el;
        },0);
        
        return sum > 0;
    }

    

    purchaseHandler = () => {
        if(this.props.isAuthenticated) {
            this.setState({purchasing : true})
        }   else {
            this.props.onSetAuthRedirectPath('/checkout');
            this.props.history.push('/auth');
        }
        
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHanlder = () => {
      this.props.onInitPurchase();
        this.props.history.push('/checkout');

    }

    render() {

        const disabledInfo = {
            ...this.props.ings
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
      

       
        let burger = this.props.error ? <p>Ingredients can't be loaded!</p> : <Spinner />

        if(this.props.ings) {

            burger = (
                <Aux>
                <Burger ingredients = {this.props.ings}/>
                   <BuildControls 
    
                   ingredientAdded = {this.props.onIngredientAdded} 
                   ingredientRemoved = {this.props.onIngredientRemoved}
                   disabled = {disabledInfo}
                   purchasable = {this.updatePurchaseState(this.props.ings)}
                   price = {this.props.price}
                   ordered = {this.purchaseHandler}
                   isAuth = {this.props.isAuthenticated}
                   />
                   </Aux>
    
            )

            orderSummary =  <OrderSummary
             ingredients = {this.props.ings} 
             price = {this.props.price}
            purchaseCanceled = {this.purchaseCancelHandler}
            purchaseContinue = {this.purchaseContinueHanlder}
      
            />  

        }



      
        return(
            <Aux>
                <Modal show = {this.state.purchasing } modalClosed ={this.purchaseCancelHandler}>
        
                {orderSummary}
                </Modal>
                {burger}
               
            </Aux>

        )
        ;
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients, 
        price: state.burgerBuilder.totalPrice,
        error: state.burgerBuilder.error,
        isAuthenticated: state.auth.token !== null
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onIngredientAdded: (ingName) => dispatch(burgerBuilderActions.addIngredient(ingName)),
        onIngredientRemoved: (ingName) => dispatch(burgerBuilderActions.removeIngredient(ingName)),
        onInitIgredients: () => dispatch(burgerBuilderActions.initIngredients()),
        onInitPurchase: () => dispatch(burgerBuilderActions.purchaseInit()),
        onSetAuthRedirectPath: (path) => dispatch(burgerBuilderActions.setAuthRedirectPath(path)) 
    }
}

export default connect(mapStateToProps,mapDispatchToProps) (withErrorHandler(BurgerBuilder, axios));

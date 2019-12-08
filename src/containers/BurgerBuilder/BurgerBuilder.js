import React, {Component} from 'react'

import Aux from '../../hoc/Aux'
import Burger from '../../components/Burger/Burger'
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal'
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary'
import axios from '../../axios-orders'
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler'
const INGREDIENT_PRICE ={
    salad: 0.5,
    cheese: 0.4,
    meat: 1.3,
    bacon: 0.7
}

class BurgerBuilder extends Component {

    state = {
        ingredients : null,
        totalPrice: 4,
        purchasable: false,
        purchasing: false,
        loading: false,
        error: false
    }
    componentDidMount = () => {
        console.log(this.props)
        axios.get('https://react-my-burger-338ef.firebaseio.com/ingredients.json')
        .then(response => {
            this.setState({ingredients: response.data})
        })
        .catch(error => {
            this.setState({error: true})
        })
    }

    updatePurchaseState (ingredients) {
     
        const sum = Object.keys(ingredients)
        
        .map(igKey => {
            return ingredients[igKey]
        }).reduce((sum,el) => {
            return sum + el;
        },0);
        this.setState({purchasable: sum > 0})
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;
        const updateIngredients = {
            ...this.state.ingredients 
        };
        updateIngredients[type] = updatedCount;
        const priceAddition = INGREDIENT_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice + priceAddition;
        this.setState({totalPrice: newPrice, ingredients: updateIngredients})
        this.updatePurchaseState(updateIngredients)
    }
    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        if(oldCount <= 0) {

        }
        const updatedCount = oldCount - 1;
        const updateIngredients = {
            ...this.state.ingredients 
        };
        updateIngredients[type] = updatedCount;
        const priceDeduction = INGREDIENT_PRICE[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients: updateIngredients})
        this.updatePurchaseState(updateIngredients)
    }

    purchaseHandler = () => {
        this.setState({purchasing : true})
    }

    purchaseCancelHandler = () => {
        this.setState({purchasing: false})
    }

    purchaseContinueHanlder = () => {
        // // alert('You continue!');
        
        this.props.history.push('/checkout');
        const queryParams = [];
        for(let i in this.state.ingredients)
        {
            queryParams.push(encodeURIComponent(i) + '=' + encodeURIComponent(this.state.ingredients[i]));
        }
        queryParams.push('price=' +this.state.totalPrice);
        const queryString = queryParams.join('&');
        this.props.history.push({
            search: '?' + queryString
        })

    }

    render() {

        const disabledInfo = {
            ...this.state.ingredients
        }
        for (let key in disabledInfo) {
            disabledInfo[key] = disabledInfo[key] <= 0
        }
        let orderSummary = null;
      

       
        let burger = this.state.error ? <p>Ingredients can't be loaded!</p> : <Spinner />

        if(this.state.ingredients) {

            burger = (
                <Aux>
                <Burger ingredients = {this.state.ingredients}/>
                   <BuildControls 
    
                   ingredientAdded = {this.addIngredientHandler} 
                   ingredientRemoved = {this.removeIngredientHandler}
                   disabled = {disabledInfo}
                   purchasable = {this.state.purchasable}
                   price = {this.state.totalPrice}
                   ordered = {this.purchaseHandler}
                   />
                   </Aux>
    
            )

            orderSummary =  <OrderSummary ingredients = {this.state.ingredients} 
            purchaseCanceled = {this.purchaseCancelHandler}
            purchaseContinue = {this.purchaseContinueHanlder}
            price = {this.state.totalPrice}
            />  

        }

        if(this.state.loading){ 
            orderSummary= <Spinner />
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
export default withErrorHandler(BurgerBuilder, axios);

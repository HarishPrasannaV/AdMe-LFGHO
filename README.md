# AdMe
**AdMe is a social media app that rewards users through GHO tokens for paying attention and engaging with advertisements.**

## Project Description
- We aim to create a fair social media platform where no one has a monopoly over advertiser revenue and ensure that users get paid a fair share for the attention they pay.
- Advertisers can publish their adverts by depositing a specific amount of GHO tokens and all the necessary details, such as an image/video URL. 
- For each token of GHO token deposited, an internal share called "Rewards" gets minted.
- An attention score is calculated based on the time the advert is visible on the user's screen and how they interact.
- Shares get internally allocated to users based on the attention score they've received for that particular instance of the advert.
- Once users have accumulated enough "Rewards" above the withdrawal threshold, they can withdraw them as GHO tokens to their account, and their corresponding internal shares get burned.

## Technical Details
### Backend:
- The leading smart contract behind the dApp is a vault smart contract which mints shares based on the amount advertisers deposit and burns shares when users choose to withdraw.
- When advertisers publish, the advert details are stored in a struct with all the details. Each advert has a unique ID called "adId", and it's used to retrieve the advert from a mapping.
- When users register with the dApp, their details get stored in a struct called "User", and they get a unique ID called "userID."
- Once a user is registered with the dApp, they'll be eligible to earn rewards.
- Each advert has a reward reserve, representing how many rewards that particular advert has to dispense. Once the reserve runs below the amount of rewards that the advert allocated to a single user, the display status is set to false, and the advert will no longer be displayed.
- The attention score for a user for a particular instance of an advert is calculated using the "calculateAttention" function.
- The dispense reward function is called when the user scrolls over the advert for the first time.
- A message containing details of the user's interaction with the advert is signed with a private key stored in an environment variable. The signature is passed along with the dispense reward function, which will then be verified on the smart contract before allocating the shares to the user.
- This is done to ensure that no one can call the function externally to dispense rewards to themselves without actually viewing the advert, and only the dApp can call the function on behalf of the user with a valid signature.
- A mapping counts the number of times a user has interacted with a particular advert, and the count is included in the message that the dApp signs. This is done to prevent replay attacks.
- We have used ConnectKit to connect users' wallets and GHO tokens as a stable coin for app payments.

### Frontend:
- We have used Next. js,shadcn/ui and tailwind css for developing the frontend.
 



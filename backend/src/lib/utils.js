import jwt from "jsonwebtoken"

// token genetate Token
export const generateToken = (userId,res)=>{

  //yha ek token generate hoga jb user sighnUp krega JWT_secrete _key ke sath 
  // token ki validaty 7 day hogi hoga
  const  token =jwt.sign({userId},process.env.JWT_SECRET, {
        expiresIn: "7d"
    })
 
    // token sending it to user
    res.cookie("jwt", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
});

    return token;
}



import { useEffect, useState } from "react";
import {TVShowAPI} from "./api/tv-show"
import s from "./style.module.css"
import { BACKDROP_BASE_URL } from "./config";
import { TVShowDetail } from "./componenets/TVShowDetail/TVShowDetail";
import {Logo} from "./componenets/Logo/Logo";
import logoImg from "./assets/images/logo.png"
import {TVShowListItem} from "./componenets/TVShowListItem/TVShowListItem";
import { TVShowList } from "./componenets/TVShowList/TVShowList";
import { SearchBar } from "./componenets/SearchBar/SearchBar";

export function App() {
   const [currentTvShow, setCurrentTvShow]= useState();
   const [recommendationList, setRecommendationList] = useState([]);
   async function fetchPopulars(){
    try {
    const popularTVShowList= await TVShowAPI.fetchPopulars();
    if(popularTVShowList.length > 0) {
    setCurrentTvShow(popularTVShowList[0])
    }
    } 
    catch (error) {
      alert("Error fetching popular TV shows: ", error);
  }
}

  async function fetchRecommendations(tvShowId) {
    try {
    const recommendationListResp = await TVShowAPI.fetchRecommendations(
      tvShowId
    );
    if (recommendationListResp.length > 0) {
      setRecommendationList(recommendationListResp.slice(0, 10));
    }
  }  catch (error) {
      alert("Error fetching recommendations: ", error);

  }
}
  
  
   useEffect(()=>{
    fetchPopulars();
    
   },[]);

   useEffect(() => {
    if (currentTvShow) {
      fetchRecommendations(currentTvShow.id);
    }
  }, [currentTvShow]);

  // console.log(recommendationList);

  // console.log(currentTvShow);
   function updateCurrentTvShow(tvshow){
    setCurrentTvShow(tvshow);
   }

   async function fetchByTitle(title) {
    try {
    const searchResponse = await TVShowAPI.fetchByTitle(title);
    if (searchResponse.length > 0) {
      setCurrentTvShow(searchResponse[0]);
    }
  } catch (error) {
      alert("Error fetching TV show by title: ", error);
  }
}
    return <div className={s.main_container} 
    style={{
      background: currentTvShow ? `linear-gradient(rgba(0, 0, 0, 0.55), rgba(0, 0, 0, 0.55)),
           url("${BACKDROP_BASE_URL}${currentTvShow.backdrop_path}") no-repeat center / cover`
        : "black",
    }}
    
    >
      <div className={s.header}>
        <div className="row">
           <div className="col-4">
              <Logo img={logoImg} title =" Watowatch"  subtitle="Find a show you may like"/>
           </div>
           <div className="col-md-12 col-lg-4">
              <SearchBar onSubmit={fetchByTitle}  />
           </div>
        </div>
      </div>
      <div className={s.tv_show_detail}>
        {currentTvShow && <TVShowDetail tvShow={currentTvShow}/>}
        
      </div>
      <div className={s.recommended_tv_shows}>
        
      {currentTvShow && <TVShowList 
      onClickItem={updateCurrentTvShow}
      tvShowList ={recommendationList}/>
     
      
    }
    </div>

      
  </div>
  }
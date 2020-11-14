# Hackton  

# Clean environment
rm(list = ls())

# perform memory trash collection
invisible(gc())

# Set US locale
Sys.setlocale("LC_TIME","English")

# 0. Libraries ------------------------------------------------------------
library(openxlsx)
library(gdata)
library(dplyr)
library(tictoc)
library(rlist)
library(tidyverse)  
library(rvest)    
library(stringr)
library(lubridate)
library(stringr)
library(httr)
library(jsonlite)

# 1. Read DBs ------------------------------------------------------------

input_path <- paste0(getwd(), "/locations.xlsx")

### dummy data ####
# entity_order <- tibble(entity_type = c("ELV", "Hospital", "Home"),
#                        order = c(1,2,3)
#)

# 2. Direct Request to entity ------------------------------------------------------------

gets_right_provider <- function(entity_order, sender_location, time_range){
  
  # get the entity_order fromJSON
  
  time <- Sys.time() + minutes(time_range)
  
  # check if entity_order is alright
  if(any(is.null(entity_order$entity_type))){
    stop("Problems with entities type input")
  }
  
  if(any(is.null(entity_order$order))){
    stop("Problems with entities order input")
  }
  
  # if alright then we are retriving some data
  entities_to_retrieve <- tibble()
  
  # make sure order is right
  entity_order <- entity_order %>% arrange(order)
  
  # get entities DB
  providers <- read.xlsx(input_path)
  
  for(type in entity_order$entity_type){
    
    providers_type <- providers %>% filter(Type == type) 
    
    if(nrow(providers_type)>0){
      entities_to_retrieve <- providers_type
      # calculate shorter distance
      break()
    }
  }
  
  if(nrow(entity_to_retrieve)>0){
    
    # convert to json
    json_to_retrieve <- toJSON(list(entities_to_retrieve$Entity_ID, time))
    return(json_to_retrieve)
  } else stop("Could not find available entities")
}